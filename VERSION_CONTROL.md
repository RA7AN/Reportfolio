# Version Control Strategy for GitHub CMS Portfolio

This document outlines the complete version control workflow for your portfolio website using the GitHub CMS approach.

## 🏗️ Project Structure

Your portfolio now uses a **file-based content management system** with the following architecture:

```
content/                 # All portfolio content (managed via Git)
├── profile/            # Personal profile
├── experiences/        # Work experience 
├── education/          # Educational background
├── projects/           # Portfolio projects
├── publications/       # Academic publications
├── talks/              # Conference talks & presentations
├── skills/             # Technical skills
├── honors/             # Awards & recognition
├── leadership/         # Leadership experience
└── writing/            # Blog posts & articles

server/                 # Backend API (GitHub CMS integration)
├── github-cms.ts       # Core CMS functionality
├── github-storage.ts   # Storage interface 
├── github-service.ts   # GitHub API integration
└── routes.ts           # API endpoints

client/                 # React frontend
```

## 📝 Content Management Workflow

### Adding New Content

1. **Create a new markdown file** in the appropriate content directory:
   ```bash
   # For a new blog post
   touch content/writing/new-post.md
   
   # For a new project
   touch content/projects/awesome-project.md
   ```

2. **Add frontmatter** at the top of the file:
   ```markdown
   ---
   title: "Your Content Title"
   date: "2024-01-15"
   description: "Brief description"
   tags: ["tag1", "tag2"]
   # Add other relevant fields based on content type
   ---
   
   Your content goes here...
   ```

3. **Commit and push changes**:
   ```bash
   git add content/
   git commit -m "Add: New blog post about [topic]"
   git push origin main
   ```

### Editing Existing Content

1. **Edit the markdown file** directly:
   ```bash
   code content/writing/existing-post.md
   ```

2. **Update frontmatter or content** as needed

3. **Commit changes**:
   ```bash
   git add content/writing/existing-post.md
   git commit -m "Update: Fix typo in blog post title"
   git push origin main
   ```

### Deleting Content

1. **Remove the file**:
   ```bash
   git rm content/projects/old-project.md
   ```

2. **Commit the deletion**:
   ```bash
   git commit -m "Remove: Outdated project from portfolio"
   git push origin main
   ```

## 🔄 Development Workflow

### Branch Strategy

Use a **feature branch workflow** for development:

```bash
# Main branch: production-ready code
main

# Feature branches: new features or content updates
feature/add-new-project
feature/update-about-section
hotfix/fix-contact-form
```

### Development Process

1. **Create a feature branch**:
   ```bash
   git checkout -b feature/add-new-blog-post
   ```

2. **Make your changes**:
   ```bash
   # Add content or code changes
   git add .
   git commit -m "Add: New blog post about React hooks"
   ```

3. **Test locally**:
   ```bash
   npm run dev
   # Verify changes at http://localhost:3000
   ```

4. **Push and create PR** (if working with team):
   ```bash
   git push origin feature/add-new-blog-post
   # Create Pull Request on GitHub
   ```

5. **Merge to main**:
   ```bash
   git checkout main
   git pull origin main
   git merge feature/add-new-blog-post
   git push origin main
   ```

### Content-only Updates

For simple content updates, you can work directly on main:

```bash
# Quick content updates
git add content/
git commit -m "Update: Latest work experience"
git push origin main
```

## 🚀 Deployment Strategy

### Current Setup
- **Local Development**: `npm run dev` (port 3000)
- **Production Build**: `npm run build` 
- **Production Start**: `npm start`

### Deployment Options

#### Option 1: Vercel (Recommended)
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy from main branch
vercel --prod
```

#### Option 2: Netlify
```bash
# Connect GitHub repo to Netlify
# Set build command: npm run build
# Set publish directory: dist
```

#### Option 3: Railway/Render
```bash
# Connect GitHub repo
# Auto-deploy on push to main
```

### Environment Variables
Ensure these are set in your deployment platform:
```bash
GITHUB_TOKEN=your_github_token
GITHUB_USERNAME=your_username
ORCID_ID=your_orcid_id
```

## 📋 Content Guidelines

### Frontmatter Templates

#### Blog Posts (`content/writing/`)
```yaml
---
title: "Your Post Title"
date: "2024-01-15"
description: "Brief description for SEO"
tags: ["react", "typescript", "webdev"]
published: true
readingTime: "5 min read"
---
```

#### Projects (`content/projects/`)
```yaml
---
title: "Project Name"
description: "What this project does"
technologies: ["React", "Node.js", "PostgreSQL"]
github: "https://github.com/yourusername/project"
demo: "https://project-demo.com"
featured: true
startDate: "2024-01-01"
endDate: "2024-03-01"
---
```

#### Experience (`content/experiences/`)
```yaml
---
title: "Software Engineer"
company: "Company Name"
location: "City, State"
startDate: "2024-01-01"
endDate: "2024-12-31"  # or null for current
type: "full-time"      # full-time, part-time, contract, internship
remote: true
---
```

### File Naming Conventions
- Use **kebab-case**: `my-awesome-project.md`
- Include **dates for time-sensitive content**: `2024-01-15-blog-post.md`
- Use **descriptive names**: `react-typescript-boilerplate.md`

## 🔧 Maintenance Tasks

### Regular Maintenance

1. **Update dependencies monthly**:
   ```bash
   npm update
   npm audit fix
   ```

2. **Review and update content quarterly**:
   - Check for outdated projects
   - Update current work status
   - Add new achievements

3. **Backup content** (automated via Git):
   ```bash
   git log --oneline content/  # Review content history
   ```

### Performance Monitoring

1. **Check build times**:
   ```bash
   time npm run build
   ```

2. **Monitor bundle size**:
   ```bash
   npm run build
   ls -la dist/
   ```

3. **Test locally before deploying**:
   ```bash
   npm run dev
   # Check all pages and features
   ```

## 📖 Git Best Practices

### Commit Messages
Use conventional commit format:
```bash
# Types: feat, fix, docs, style, refactor, test, chore
git commit -m "feat: Add RSS feed for blog posts"
git commit -m "fix: Correct typo in about page"
git commit -m "docs: Update installation instructions"
git commit -m "content: Add new project showcase"
```

### Useful Git Commands
```bash
# View content history
git log --oneline --follow content/writing/

# See what's changed
git status
git diff

# Undo last commit (keep changes)
git reset --soft HEAD~1

# View branches
git branch -a

# Clean up merged branches
git branch --merged | grep -v main | xargs git branch -d
```

## 🆘 Troubleshooting

### Common Issues

1. **Content not showing up**: Check markdown frontmatter syntax
2. **Build fails**: Check for invalid YAML in frontmatter
3. **Images not loading**: Ensure images are in `client/public/` directory
4. **API errors**: Check environment variables are set correctly

### Debug Commands
```bash
# Check TypeScript errors
npm run check

# View server logs
npm run dev  # Check terminal output

# Test content parsing
node -e "
  import { GitHubCMS } from './server/github-cms.js';
  const cms = new GitHubCMS('./content');
  console.log(await cms.getAllWriting());
"
```

---

## 🎯 Summary

Your portfolio now operates as a **Git-based CMS** where:
- ✅ All content is version controlled
- ✅ No database required
- ✅ Easy to backup and migrate
- ✅ Content can be edited in any text editor
- ✅ Changes are automatically deployed
- ✅ Full history of all content changes

This approach gives you complete control over your content while maintaining simplicity and reliability.