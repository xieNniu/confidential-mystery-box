# 📤 GitHub Upload Guide

This guide will help you upload the Confidential Mystery Box project to GitHub.

## ✅ Pre-Upload Checklist

Before uploading, ensure:
- [x] All sensitive files are removed
- [x] `.gitignore` is properly configured
- [x] `hardhat.config.js` uses environment variables
- [x] No private keys or mnemonics in code
- [x] All documentation is complete
- [x] Project is in English

## 🚀 Method 1: Using GitHub Web Interface (Recommended for Beginners)

### Step 1: Create a New Repository on GitHub

1. Go to [GitHub.com](https://github.com) and log in
2. Click the **"+"** icon in the top right, select **"New repository"**
3. Fill in repository details:
   - **Repository name**: `confidential-mystery-box`
   - **Description**: `A decentralized mystery box system with fully encrypted prizes using Zama FHEVM`
   - **Visibility**: Choose **Public** or **Private**
   - **DO NOT** initialize with README, .gitignore, or license (we already have these)
4. Click **"Create repository"**

### Step 2: Initialize Git (if not already done)

Open terminal in your project root and run:

```bash
git init
git add .
git commit -m "Initial commit: Confidential Mystery Box v1.0"
```

### Step 3: Connect to GitHub Repository

Copy the commands from GitHub's "Quick setup" page, they should look like:

```bash
git remote add origin https://github.com/YOUR_USERNAME/confidential-mystery-box.git
git branch -M main
git push -u origin main
```

**Replace `YOUR_USERNAME` with your actual GitHub username!**

## 🔧 Method 2: Using GitHub Desktop (Easiest)

### Step 1: Download GitHub Desktop

Download from: https://desktop.github.com/

### Step 2: Add Repository

1. Open GitHub Desktop
2. Click **File** → **Add Local Repository**
3. Navigate to your project folder
4. Click **"Create a repository"** if it's not a Git repo yet

### Step 3: Publish

1. Review the files to be committed
2. Add a commit message: `Initial commit: Confidential Mystery Box v1.0`
3. Click **"Commit to main"**
4. Click **"Publish repository"**
5. Choose visibility (Public/Private)
6. Click **"Publish repository"**

Done! 🎉

## 💻 Method 3: Using Git Command Line (Advanced)

### Step 1: Verify Git is Installed

```bash
git --version
```

If not installed, download from: https://git-scm.com/

### Step 2: Initialize and Add Files

```bash
# Initialize git repository
git init

# Add all files to staging
git add .

# Check what will be committed
git status

# Commit with message
git commit -m "Initial commit: Confidential Mystery Box v1.0"
```

### Step 3: Create GitHub Repository

1. Go to GitHub and create a new repository (as described in Method 1)
2. **DO NOT** initialize with any files

### Step 4: Connect and Push

```bash
# Add remote repository
git remote add origin https://github.com/YOUR_USERNAME/confidential-mystery-box.git

# Verify remote was added
git remote -v

# Rename branch to main (if needed)
git branch -M main

# Push to GitHub
git push -u origin main
```

## 🔍 Verify Upload

After uploading, check these on GitHub:

- [ ] All source files are present
- [ ] README.md displays correctly
- [ ] `.gitignore` is working (no `node_modules/`, `.env`, etc.)
- [ ] LICENSE file is visible
- [ ] CONTRIBUTING.md is accessible
- [ ] No sensitive information is exposed

## 🛡️ Security Reminders

### ⚠️ NEVER Upload These Files:
- `.env` (contains private keys!)
- `deployment_fhe.json` (contains contract addresses)
- `deployment_simple.json`
- `node_modules/`
- Any files with private keys or mnemonics

### ✅ These Files SHOULD Be Uploaded:
- `README.md`
- `LICENSE`
- `CONTRIBUTING.md`
- `SECURITY.md`
- `.gitignore`
- `env.example`
- All source code files
- Package files (`package.json`, `package-lock.json`)

## 🔄 Making Updates

After the initial upload, to push changes:

```bash
# Check current status
git status

# Add changed files
git add .

# Or add specific files
git add path/to/file.js

# Commit with descriptive message
git commit -m "feat: add NFT prize support"

# Push to GitHub
git push
```

## 📋 Commit Message Guidelines

Follow conventional commits:

- `feat:` - New feature
- `fix:` - Bug fix
- `docs:` - Documentation changes
- `style:` - Code formatting
- `refactor:` - Code refactoring
- `test:` - Adding tests
- `chore:` - Maintenance tasks

**Examples:**
```bash
git commit -m "feat: add leaderboard functionality"
git commit -m "fix: resolve wallet connection issue"
git commit -m "docs: update README with new features"
```

## 🏷️ Creating Releases

### For Version 1.0.0:

1. Go to your GitHub repository
2. Click **"Releases"** → **"Create a new release"**
3. Click **"Choose a tag"** → type `v1.0.0` → **"Create new tag"**
4. **Release title**: `v1.0.0 - Initial Release`
5. **Description**: 
```markdown
## 🎉 Initial Release

### Features
- ✅ FHE-encrypted mystery box system
- ✅ Dual contract architecture
- ✅ Arcade-style UI
- ✅ MetaMask integration
- ✅ Sepolia testnet deployment

### Tech Stack
- Solidity 0.8.24
- React 18 + TypeScript
- Zama FHEVM v0.5.8
- Hardhat

**Deployed on Sepolia Testnet**
```
6. Click **"Publish release"**

## 🌟 Making Your Repo Stand Out

### Add Topics/Tags

On your repository page:
1. Click the gear icon next to "About"
2. Add topics:
   - `blockchain`
   - `ethereum`
   - `fhe`
   - `zama`
   - `mystery-box`
   - `smart-contracts`
   - `solidity`
   - `react`
   - `typescript`
   - `web3`

### Pin Repository

On your GitHub profile:
1. Go to your profile page
2. Click **"Customize your pins"**
3. Select this repository
4. Save changes

## 📊 GitHub Repository Settings

### Recommended Settings:

1. **General**
   - [x] Wikis (for documentation)
   - [x] Issues (for bug reports)
   - [x] Discussions (for community)
   - [ ] Projects (optional)

2. **Collaborators & Teams**
   - Add team members if working with others

3. **Branches**
   - Set `main` as default branch
   - Add branch protection rules (optional):
     - Require pull request reviews
     - Require status checks to pass

4. **Pages** (optional)
   - Enable GitHub Pages for documentation site

## 🎯 Next Steps After Upload

1. **Share Your Project**
   - Post on Twitter with #Zama #FHEVM #Web3
   - Share in blockchain developer communities
   - Submit to Zama Developer Program

2. **Add Badges to README**
   - Build status
   - License badge
   - Code coverage
   - Latest release

3. **Set Up CI/CD** (optional)
   - GitHub Actions for automated testing
   - Automatic deployment
   - Code quality checks

4. **Monitor Activity**
   - Watch for issues and PRs
   - Respond to community questions
   - Update documentation as needed

## ❓ Troubleshooting

### "Permission Denied" Error

Solution: Use Personal Access Token instead of password
1. Go to GitHub Settings → Developer settings → Personal access tokens
2. Generate new token (classic)
3. Select scopes: `repo`, `workflow`
4. Use token as password when pushing

### "Remote Origin Already Exists"

Solution:
```bash
# Remove existing remote
git remote remove origin

# Add correct remote
git remote add origin https://github.com/YOUR_USERNAME/confidential-mystery-box.git
```

### Large Files Warning

If you accidentally added large files:
```bash
# Remove from git history
git filter-branch --force --index-filter \
  "git rm --cached --ignore-unmatch PATH_TO_FILE" \
  --prune-empty --tag-name-filter cat -- --all
```

## 📞 Need Help?

- GitHub Documentation: https://docs.github.com
- Git Documentation: https://git-scm.com/doc
- Contact project maintainers

---

Good luck with your upload! 🚀

**Remember**: Once uploaded to a public repository, consider it permanent. Always review before pushing!

