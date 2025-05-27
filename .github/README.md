# GitHub Actions Workflows

This directory contains GitHub Actions workflows for the Freelance Marketplace project.

## 🚀 Workflows Overview

### 1. **CI/CD Pipeline** (`ci.yml`)
**Triggers**: Push to `main`/`develop`, Pull Requests
**Purpose**: Continuous Integration and Quality Assurance

**Jobs**:
- **Lint & Type Check**: ESLint, TypeScript, Prettier
- **Test Backend**: Unit tests with PostgreSQL
- **Build Applications**: Build all packages and apps

**Features**:
- ✅ Parallel job execution
- ✅ Dependency caching
- ✅ Build artifact upload
- ✅ Database testing with PostgreSQL service

### 2. **Docker Build & Deploy** (`docker.yml`)
**Triggers**: Push to `main`, Tags, Pull Requests
**Purpose**: Docker image building and testing

**Jobs**:
- **Docker Build**: Build and push images to GitHub Container Registry
- **Docker Compose Test**: Test both development and full setups
- **Security Scan**: Vulnerability scanning with Trivy

**Features**:
- ✅ Multi-platform builds (AMD64, ARM64)
- ✅ Image caching for faster builds
- ✅ Automatic tagging (branch, PR, semver)
- ✅ Security vulnerability scanning

### 3. **Code Quality & Security** (`codeql.yml`)
**Triggers**: Push, Pull Requests, Weekly schedule
**Purpose**: Security analysis and code quality

**Jobs**:
- **CodeQL Analysis**: Static analysis for security issues
- **Dependency Review**: Check for vulnerable dependencies
- **Secret Scanning**: Detect exposed secrets

**Features**:
- ✅ Multi-language analysis (JavaScript, TypeScript)
- ✅ Security and quality queries
- ✅ Dependency vulnerability checks
- ✅ Secret detection with TruffleHog

### 4. **Maintenance** (`maintenance.yml`)
**Triggers**: Weekly schedule, Manual trigger
**Purpose**: Automated maintenance tasks

**Jobs**:
- **Update Dependencies**: Automated dependency updates
- **Cleanup Runs**: Remove old workflow runs
- **Cleanup Images**: Remove old Docker images

**Features**:
- ✅ Automated dependency updates with PR creation
- ✅ Workflow run cleanup (30 days retention)
- ✅ Docker image cleanup (keep 10 versions)

### 5. **Release** (`release.yml`)
**Triggers**: Git tags (`v*`)
**Purpose**: Automated releases

**Jobs**:
- **Create Release**: Generate GitHub release with changelog
- **Build Release Images**: Build and tag Docker images
- **Update Docker Compose**: Create release-specific compose file

**Features**:
- ✅ Automatic changelog generation
- ✅ Semantic versioning support
- ✅ Release Docker images with proper tags
- ✅ Release-specific Docker Compose files

## 🔧 Setup Requirements

### Repository Secrets
No additional secrets required! All workflows use `GITHUB_TOKEN` which is automatically provided.

### Repository Settings
1. **Enable GitHub Packages**: For Docker image storage
2. **Enable Security Features**:
   - Dependency graph
   - Dependabot alerts
   - Code scanning alerts
   - Secret scanning

### Branch Protection
Recommended branch protection rules for `main`:
- Require status checks to pass
- Require branches to be up to date
- Require review from code owners
- Restrict pushes to matching branches

## 📊 Workflow Status Badges

Add these badges to your main README.md:

```markdown
[![CI/CD](https://github.com/your-username/freelance_market/actions/workflows/ci.yml/badge.svg)](https://github.com/your-username/freelance_market/actions/workflows/ci.yml)
[![Docker](https://github.com/your-username/freelance_market/actions/workflows/docker.yml/badge.svg)](https://github.com/your-username/freelance_market/actions/workflows/docker.yml)
[![CodeQL](https://github.com/your-username/freelance_market/actions/workflows/codeql.yml/badge.svg)](https://github.com/your-username/freelance_market/actions/workflows/codeql.yml)
```

## 🐳 Using Docker Images

### Pull Latest Images
```bash
# Pull server image
docker pull ghcr.io/your-username/freelance_market/server:latest

# Pull web image
docker pull ghcr.io/your-username/freelance_market/web:latest
```

### Use Release Images
```bash
# Use specific version
docker pull ghcr.io/your-username/freelance_market/server:1.0.0
docker pull ghcr.io/your-username/freelance_market/web:1.0.0
```

## 🔄 Development Workflow

### 1. Feature Development
```bash
# Create feature branch
git checkout -b feature/new-feature

# Make changes and commit
git add .
git commit -m "feat: add new feature"

# Push and create PR
git push origin feature/new-feature
```

### 2. Pull Request Process
1. **Automated Checks**: CI/CD pipeline runs automatically
2. **Code Review**: Team reviews the changes
3. **Security Scan**: CodeQL and dependency review
4. **Docker Test**: Docker Compose setup tested
5. **Merge**: After approval and passing checks

### 3. Release Process
```bash
# Create and push tag
git tag v1.0.0
git push origin v1.0.0

# Release workflow automatically:
# - Creates GitHub release
# - Builds Docker images
# - Updates documentation
```

## 🛠 Customization

### Adding New Jobs
1. Edit the appropriate workflow file
2. Follow the existing pattern for caching and setup
3. Test with a pull request first

### Modifying Triggers
Update the `on:` section in workflow files:
```yaml
on:
  push:
    branches: [ main, develop, staging ]
  pull_request:
    branches: [ main ]
```

### Environment Variables
Add environment variables at the workflow or job level:
```yaml
env:
  NODE_VERSION: '20'
  CUSTOM_VAR: 'value'
```

## 📈 Monitoring

### Workflow Runs
- View in GitHub Actions tab
- Check logs for failed runs
- Monitor build times and success rates

### Security Alerts
- Check Security tab for vulnerabilities
- Review Dependabot alerts
- Monitor CodeQL findings

### Performance
- Monitor Docker image sizes
- Check build times
- Review cache hit rates
