# ✅ Pre-Upload Checklist for GitHub

**IMPORTANT**: Review this checklist before uploading to GitHub!

## 🔒 Security Check

### Critical - Must Be Removed/Protected
- [ ] No private keys in any files
- [ ] No wallet mnemonics in any files
- [ ] No `.env` file in repository (should be in `.gitignore`)
- [ ] `hardhat.config.js` uses environment variables only
- [ ] No hardcoded API keys or tokens
- [ ] No real wallet addresses with funds

### Files That Should NOT Be Uploaded
- [ ] `.env` (contains secrets)
- [ ] `node_modules/` (too large, regenerated)
- [ ] `artifacts/` (build output)
- [ ] `cache/` (build cache)
- [ ] `deployment_*.json` (may contain sensitive addresses)
- [ ] Any `*.bat` or personal scripts
- [ ] Chinese documentation files

## 📝 Documentation Check

### Required Files Present
- [ ] `README.md` - Complete and in English
- [ ] `LICENSE` - MIT or chosen license
- [ ] `CONTRIBUTING.md` - Contribution guidelines
- [ ] `SECURITY.md` - Security policy
- [ ] `.gitignore` - Properly configured
- [ ] `env.example` - Configuration template

### README.md Contains
- [ ] Project description
- [ ] Features list
- [ ] Installation instructions
- [ ] Usage guide
- [ ] Technology stack
- [ ] License information
- [ ] Contact/links

## 🛠️ Configuration Check

### .gitignore Properly Excludes
- [ ] `node_modules/`
- [ ] `.env` and `.env.*`
- [ ] `artifacts/`
- [ ] `cache/`
- [ ] IDE files (`.vscode/`, `.idea/`)
- [ ] OS files (`.DS_Store`, `Thumbs.db`)
- [ ] Build outputs
- [ ] Deployment records

### Environment Configuration
- [ ] `env.example` file created
- [ ] All sensitive values replaced with placeholders
- [ ] Clear instructions for each environment variable
- [ ] No default secrets in `hardhat.config.js`

## 📁 File Structure Check

### Smart Contracts
- [ ] All `.sol` files in `contracts/` folder
- [ ] No hardcoded addresses or keys
- [ ] Properly commented
- [ ] Compilation successful

### Scripts
- [ ] Deployment scripts in `scripts/` folder
- [ ] No scripts with hardcoded private keys
- [ ] Clear naming conventions
- [ ] Comments explaining usage

### Frontend
- [ ] All source files in `frontend/src/`
- [ ] Configuration in `frontend/src/config/`
- [ ] No API keys in frontend code
- [ ] Contract addresses use placeholders or env vars

## 🧹 Code Cleanup

### Remove Temporary Files
- [ ] No debug files (`App-debug.tsx`, etc.)
- [ ] No backup files (`*.bak`, `*.tmp`)
- [ ] No duplicate files
- [ ] No commented-out code blocks
- [ ] No `console.log` statements (or marked for production)

### Code Quality
- [ ] All functions properly named
- [ ] Comments in English
- [ ] Consistent formatting
- [ ] No TODO comments pointing to sensitive info
- [ ] Type definitions complete (TypeScript)

## 🌐 Language Check

### All User-Facing Text in English
- [ ] UI components text
- [ ] Error messages
- [ ] Success messages
- [ ] Button labels
- [ ] Form placeholders
- [ ] Documentation
- [ ] Code comments
- [ ] README and guides

## 🧪 Testing

### Functionality
- [ ] Smart contracts compile without errors
- [ ] Frontend builds successfully
- [ ] All npm scripts work
- [ ] No broken imports
- [ ] Dependencies all resolved

### Run These Commands
```bash
# Root directory
npm install
npx hardhat compile

# Frontend
cd frontend
npm install
npm run build
```

- [ ] All commands execute without errors

## 📦 Package Files

### package.json (Root)
- [ ] Correct project name
- [ ] Version number set (e.g., `1.0.0`)
- [ ] Description present
- [ ] License specified
- [ ] Repository field added
- [ ] Keywords added
- [ ] Author information

### package.json (Frontend)
- [ ] Correct dependencies
- [ ] Scripts configured
- [ ] No private packages

## 🔗 GitHub-Specific

### Repository Metadata
- [ ] Repository name chosen
- [ ] Description prepared
- [ ] Topics/tags identified
- [ ] License chosen (MIT recommended)

### Additional Files
- [ ] Issue templates created
- [ ] PR template created
- [ ] GitHub Actions workflows (if any)

## 🎨 README Enhancements

### Badges to Add (Optional)
- [ ] License badge
- [ ] Build status badge
- [ ] Powered by Zama badge
- [ ] Network badge (Sepolia)

### Screenshots/Demo
- [ ] Screenshots of UI prepared
- [ ] GIF/video demo created (optional)
- [ ] Architecture diagram created (optional)

## 🚀 Pre-Commit Commands

Run these before committing:

```bash
# Clean install
rm -rf node_modules
npm install

# Clean frontend
cd frontend
rm -rf node_modules dist
npm install
npm run build
cd ..

# Compile contracts
npx hardhat clean
npx hardhat compile

# Verify no secrets
git grep -i "private.*key"
git grep -i "mnemonic"
git grep -i "secret"
```

- [ ] All commands successful
- [ ] No secrets found in grep

## 📋 Final Verification

### Double-Check These Files
```bash
# Review these critical files one more time
.gitignore
hardhat.config.js
env.example
README.md
package.json
frontend/src/config/constants.ts
```

### Manual Review Checklist
- [ ] Open each file listed above
- [ ] Verify no sensitive information
- [ ] Check all paths are relative (not absolute)
- [ ] Confirm placeholders used for addresses/keys

## 🎯 Ready to Upload?

If ALL items above are checked:
- ✅ **YES** - Proceed to `GITHUB_UPLOAD_GUIDE.md`
- ❌ **NO** - Fix remaining items first

## ⚠️ Last Warning

Before running `git push`:

1. Review `git status` output
2. Check `git diff` for unexpected changes
3. Review commit with `git show`
4. Remember: **Once pushed, it's public forever!**

## 🆘 Emergency - Already Pushed Secrets?

If you accidentally pushed secrets:

1. **Immediately** change all exposed credentials
2. Rotate private keys
3. Create new wallet if needed
4. Contact GitHub support to purge history (if needed)
5. Force push cleaned history (use with caution)

```bash
# WARNING: This rewrites history!
git filter-branch --force --index-filter \
  "git rm --cached --ignore-unmatch .env" \
  --prune-empty --tag-name-filter cat -- --all

git push origin --force --all
```

---

## ✨ Upload Command Sequence

When all checks pass:

```bash
# Initialize git (if not already done)
git init

# Add all files
git add .

# Verify what's being added
git status

# Review differences
git diff --cached

# Commit
git commit -m "Initial commit: Confidential Mystery Box v1.0"

# Add remote (replace YOUR_USERNAME)
git remote add origin https://github.com/YOUR_USERNAME/confidential-mystery-box.git

# Push to GitHub
git push -u origin main
```

---

**Date Checked**: _______________

**Checked By**: _______________

**Ready for Upload**: ☐ YES  ☐ NO

---

Good luck! 🍀

