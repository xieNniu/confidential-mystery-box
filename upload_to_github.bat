@echo off
chcp 65001 >nul
echo ================================================
echo   GitHub Upload Helper - Confidential Mystery Box
echo ================================================
echo.

REM 检查是否安装了 Git
where git >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo ❌ Error: Git is not installed!
    echo.
    echo Please install Git from: https://git-scm.com/download/win
    echo.
    pause
    exit /b 1
)

echo ✅ Git detected
echo.

REM 初始化 Git 仓库（如果还没有）
if not exist ".git" (
    echo 📦 Initializing Git repository...
    git init
    echo ✅ Git repository initialized
    echo.
) else (
    echo ✅ Git repository already exists
    echo.
)

REM 检查是否有 .env 文件（安全检查）
if exist ".env" (
    echo.
    echo ⚠️  WARNING: Found .env file!
    echo ⚠️  This file contains sensitive information and should NOT be uploaded!
    echo.
    echo Do you want to continue? The .env file will be ignored by .gitignore.
    echo Press Ctrl+C to cancel, or
    pause
)

REM 添加所有文件
echo 📝 Adding files to Git...
git add .
if %ERRORLEVEL% NEQ 0 (
    echo ❌ Failed to add files
    pause
    exit /b 1
)
echo ✅ Files added successfully
echo.

REM 显示将要提交的文件
echo 📋 Files to be committed:
echo ----------------------------------------
git status --short
echo ----------------------------------------
echo.

REM 确认提交
echo Do you want to commit these files?
echo Press Ctrl+C to cancel, or
pause

REM 提交
echo.
echo 💾 Committing files...
git commit -m "Initial commit: Confidential Mystery Box v1.0"
if %ERRORLEVEL% NEQ 0 (
    echo.
    echo ⚠️  Note: If you see 'nothing to commit', it means all files are already committed.
    echo.
)
echo.

REM 检查分支名称
for /f "tokens=*" %%i in ('git branch --show-current') do set CURRENT_BRANCH=%%i
if "%CURRENT_BRANCH%"=="" (
    echo 🌿 Creating main branch...
    git branch -M main
) else if not "%CURRENT_BRANCH%"=="main" (
    echo 🌿 Renaming branch to main...
    git branch -M main
)
echo ✅ Branch set to 'main'
echo.

REM 询问 GitHub 用户名和仓库名
echo ================================================
echo   GitHub Repository Information
echo ================================================
echo.
echo Please provide your GitHub information:
echo.

set /p GITHUB_USERNAME="Enter your GitHub username: "
if "%GITHUB_USERNAME%"=="" (
    echo ❌ Username cannot be empty!
    pause
    exit /b 1
)

set /p REPO_NAME="Enter repository name (default: confidential-mystery-box): "
if "%REPO_NAME%"=="" set REPO_NAME=confidential-mystery-box

echo.
echo 📍 Remote URL will be: https://github.com/%GITHUB_USERNAME%/%REPO_NAME%.git
echo.

REM 检查是否已有 remote
git remote get-url origin >nul 2>nul
if %ERRORLEVEL% EQU 0 (
    echo 🔗 Updating remote URL...
    git remote set-url origin https://github.com/%GITHUB_USERNAME%/%REPO_NAME%.git
) else (
    echo 🔗 Adding remote repository...
    git remote add origin https://github.com/%GITHUB_USERNAME%/%REPO_NAME%.git
)

if %ERRORLEVEL% NEQ 0 (
    echo ❌ Failed to set remote repository
    pause
    exit /b 1
)
echo ✅ Remote repository configured
echo.

REM 推送到 GitHub
echo ================================================
echo   Ready to Push to GitHub!
echo ================================================
echo.
echo ⚠️  IMPORTANT: Before continuing, make sure you have:
echo   1. Created the repository on GitHub: https://github.com/%GITHUB_USERNAME%/%REPO_NAME%
echo   2. The repository should be EMPTY (no README, no .gitignore, no license)
echo.
echo When you push, GitHub will ask for your credentials:
echo   - Username: %GITHUB_USERNAME%
echo   - Password: Use your Personal Access Token (NOT your GitHub password!)
echo.
echo How to create a Personal Access Token:
echo   1. Go to: https://github.com/settings/tokens
echo   2. Click "Generate new token (classic)"
echo   3. Give it a name and select 'repo' scope
echo   4. Copy the token and use it as password
echo.
echo Press Ctrl+C to cancel, or
pause

echo.
echo 🚀 Pushing to GitHub...
git push -u origin main

if %ERRORLEVEL% EQU 0 (
    echo.
    echo ================================================
    echo   ✅ SUCCESS! 
    echo ================================================
    echo.
    echo Your project has been uploaded to:
    echo 🔗 https://github.com/%GITHUB_USERNAME%/%REPO_NAME%
    echo.
    echo Next steps:
    echo   1. Visit your repository on GitHub
    echo   2. Add a description and topics
    echo   3. Share with the community!
    echo.
) else (
    echo.
    echo ================================================
    echo   ❌ Push Failed
    echo ================================================
    echo.
    echo Common issues:
    echo   1. Repository doesn't exist on GitHub yet
    echo      → Create it at: https://github.com/new
    echo.
    echo   2. Wrong credentials
    echo      → Use Personal Access Token, not password
    echo      → Generate at: https://github.com/settings/tokens
    echo.
    echo   3. Permission denied
    echo      → Check if you're the owner of the repository
    echo      → Verify the token has 'repo' permissions
    echo.
    echo Try running this script again after fixing the issue.
    echo.
)

echo Press any key to exit...
pause >nul

