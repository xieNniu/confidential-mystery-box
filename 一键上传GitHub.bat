@echo off
chcp 65001 >nul
SETLOCAL EnableDelayedExpansion

echo.
echo ========================================
echo   GitHub 一键上传工具
echo ========================================
echo.

:: 检查是否在正确的目录
if not exist "package.json" (
    echo ❌ 错误：请在项目根目录运行此脚本！
    echo    当前目录：%CD%
    pause
    exit /b 1
)

echo ✅ 当前位置正确：%CD%
echo.

:: 检查Git是否已初始化
if not exist ".git" (
    echo ❌ Git尚未初始化！正在初始化...
    git init
    git add .
    git commit -m "Initial commit: Confidential Mystery Box"
    git branch -M main
    echo ✅ Git初始化完成！
) else (
    echo ✅ Git已初始化
)

echo.
echo ========================================
echo   第1步：请输入你的GitHub信息
echo ========================================
echo.

:: 获取GitHub用户名
SET /P GITHUB_USERNAME="请输入你的GitHub用户名: "

if "!GITHUB_USERNAME!"=="" (
    echo ❌ 用户名不能为空！
    pause
    exit /b 1
)

echo.
echo 你的用户名是: !GITHUB_USERNAME!
echo 仓库名称: confidential-mystery-box
echo.
echo ⚠️  重要提示：
echo    1. 请确保你已在GitHub上创建了空仓库：confidential-mystery-box
echo    2. 一会儿会要求输入密码，请粘贴你的Personal Access Token（不是密码！）
echo    3. Token以 ghp_ 开头，粘贴时不会显示，这是正常的，粘贴后直接按回车
echo.
pause

echo.
echo ========================================
echo   第2步：检查远程仓库
echo ========================================
echo.

:: 检查是否已有origin
git remote -v | findstr "origin" >nul 2>&1
if !ERRORLEVEL! EQU 0 (
    echo ⚠️  检测到已存在的远程仓库，正在移除...
    git remote remove origin
    echo ✅ 已移除旧的远程配置
)

:: 添加新的远程仓库
SET REPO_URL=https://github.com/!GITHUB_USERNAME!/confidential-mystery-box.git
echo.
echo 正在设置远程仓库：!REPO_URL!
git remote add origin !REPO_URL!

if !ERRORLEVEL! NEQ 0 (
    echo ❌ 设置远程仓库失败！
    pause
    exit /b 1
)

echo ✅ 远程仓库设置成功！
echo.

echo ========================================
echo   第3步：推送到GitHub
echo ========================================
echo.
echo 正在推送... 请在弹窗中输入：
echo   Username: !GITHUB_USERNAME!
echo   Password: 粘贴你的Token（ghp_开头）
echo.

git push -u origin main

if !ERRORLEVEL! EQU 0 (
    echo.
    echo ========================================
    echo   🎉 成功！项目已上传到GitHub！
    echo ========================================
    echo.
    echo 🔗 访问你的项目：
    echo    https://github.com/!GITHUB_USERNAME!/confidential-mystery-box
    echo.
    echo 📝 接下来你可以：
    echo    1. 在GitHub上编辑README.md添加项目描述
    echo    2. 在Settings中设置GitHub Pages部署前端
    echo    3. 邀请其他开发者协作
    echo.
) else (
    echo.
    echo ========================================
    echo   ❌ 推送失败！
    echo ========================================
    echo.
    echo 可能的原因：
    echo   1. GitHub仓库不存在 - 请先在 https://github.com/new 创建
    echo   2. Token无效 - 请检查Token是否有repo权限
    echo   3. 用户名错误 - 请检查拼写
    echo   4. 网络问题 - 请检查网络连接
    echo.
    echo 💡 解决方法：
    echo   1. 确认在GitHub创建了空仓库 confidential-mystery-box
    echo   2. 确认Token有完整的repo权限
    echo   3. 重新运行此脚本
    echo.
)

echo.
pause
ENDLOCAL

