import { graphql } from "@octokit/graphql";

interface GitHubRepository {
  id: string;
  name: string;
  description: string | null;
  url: string;
  homepageUrl: string | null;
  stargazerCount: number;
  forkCount: number;
  primaryLanguage: {
    name: string;
    color: string;
  } | null;
  repositoryTopics: {
    nodes: Array<{
      topic: {
        name: string;
      };
    }>;
  };
  createdAt: string;
  updatedAt: string;
  isPrivate: boolean;
  isEmpty: boolean;
}

interface GitHubProfile {
  name: string | null;
  bio: string | null;
  company: string | null;
  location: string | null;
  pinnedItems: {
    nodes: GitHubRepository[];
  };
  repositories: {
    nodes: GitHubRepository[];
    totalCount: number;
  };
}

const GITHUB_QUERY = `
  query($username: String!) {
    user(login: $username) {
      name
      bio
      company
      location
      pinnedItems(first: 6, types: [REPOSITORY]) {
        nodes {
          ... on Repository {
            id
            name
            description
            url
            homepageUrl
            stargazerCount
            forkCount
            primaryLanguage {
              name
              color
            }
            repositoryTopics(first: 10) {
              nodes {
                topic {
                  name
                }
              }
            }
            createdAt
            updatedAt
            isPrivate
            isEmpty
          }
        }
      }
      repositories(first: 20, orderBy: {field: UPDATED_AT, direction: DESC}, ownerAffiliations: OWNER, isFork: false) {
        nodes {
          id
          name
          description
          url
          homepageUrl
          stargazerCount
          forkCount
          primaryLanguage {
            name
            color
          }
          repositoryTopics(first: 10) {
            nodes {
              topic {
                name
              }
            }
          }
          createdAt
          updatedAt
          isPrivate
          isEmpty
        }
        totalCount
      }
    }
  }
`;

export class GitHubService {
  private static githubToken = process.env.GITHUB_TOKEN;
  private static username = process.env.GITHUB_USERNAME || "RA7AN";

  static async fetchGitHubData(): Promise<GitHubProfile | null> {
    if (!this.githubToken) {
      console.warn('GitHub token not provided. Skipping GitHub integration.');
      return null;
    }

    try {
      const graphqlWithAuth = graphql.defaults({
        headers: {
          authorization: `token ${this.githubToken}`,
        },
      });

      const data: { user: GitHubProfile } = await graphqlWithAuth(GITHUB_QUERY, {
        username: this.username,
      });

      return data.user;
    } catch (error) {
      console.error('Failed to fetch GitHub data:', error);
      return null;
    }
  }

  static async getPinnedRepositories(): Promise<GitHubRepository[]> {
    const profile = await this.fetchGitHubData();
    return profile?.pinnedItems.nodes.filter(repo => !repo.isPrivate && !repo.isEmpty) || [];
  }

  static async getTopRepositories(limit: number = 10): Promise<GitHubRepository[]> {
    const profile = await this.fetchGitHubData();
    return profile?.repositories.nodes
      .filter(repo => !repo.isPrivate && !repo.isEmpty)
      .slice(0, limit) || [];
  }

  static async getRepositoryStats(): Promise<{totalRepos: number, totalStars: number, languages: string[]}> {
    const profile = await this.fetchGitHubData();
    if (!profile) return { totalRepos: 0, totalStars: 0, languages: [] };

    const repos = profile.repositories.nodes.filter(repo => !repo.isPrivate);
    const totalStars = repos.reduce((sum, repo) => sum + repo.stargazerCount, 0);
    const languages = [...new Set(repos.map(repo => repo.primaryLanguage?.name).filter(Boolean))];

    return {
      totalRepos: repos.length,
      totalStars,
      languages
    };
  }
}