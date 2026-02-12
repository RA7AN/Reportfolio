import { useQuery } from "@tanstack/react-query";

// GitHub API hooks
export function useGitHubRepositories() {
  return useQuery({
    queryKey: ['github', 'repositories'],
    queryFn: async () => {
      const response = await fetch('/api/github/repositories');
      if (!response.ok) {
        throw new Error('Failed to fetch repositories');
      }
      return response.json();
    },
    staleTime: 1000 * 60 * 30, // 30 minutes
  });
}

export function useGitHubPinned() {
  return useQuery({
    queryKey: ['github', 'pinned'],
    queryFn: async () => {
      const response = await fetch('/api/github/pinned');
      if (!response.ok) {
        throw new Error('Failed to fetch pinned repositories');
      }
      return response.json();
    },
    staleTime: 1000 * 60 * 30, // 30 minutes
  });
}

export function useGitHubStats() {
  return useQuery({
    queryKey: ['github', 'stats'],
    queryFn: async () => {
      const response = await fetch('/api/github/stats');
      if (!response.ok) {
        throw new Error('Failed to fetch GitHub stats');
      }
      return response.json();
    },
    staleTime: 1000 * 60 * 30, // 30 minutes
  });
}

// ORCID API hooks
export function useORCIDPublications() {
  return useQuery({
    queryKey: ['orcid', 'publications'],
    queryFn: async () => {
      const response = await fetch('/api/orcid/publications');
      if (!response.ok) {
        throw new Error('Failed to fetch ORCID publications');
      }
      return response.json();
    },
    staleTime: 1000 * 60 * 60, // 1 hour
  });
}

export function useORCIDStats() {
  return useQuery({
    queryKey: ['orcid', 'stats'],
    queryFn: async () => {
      const response = await fetch('/api/orcid/stats');
      if (!response.ok) {
        throw new Error('Failed to fetch ORCID stats');
      }
      return response.json();
    },
    staleTime: 1000 * 60 * 60, // 1 hour
  });
}

// RSS sync hook
export function useRSSSync() {
  return useQuery({
    queryKey: ['rss', 'sync'],
    queryFn: async () => {
      const response = await fetch('/api/rss/sync', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      if (!response.ok) {
        throw new Error('Failed to sync RSS feeds');
      }
      return response.json();
    },
    enabled: false, // Only run when explicitly triggered
    staleTime: 0, // Always fresh when called
  });
}