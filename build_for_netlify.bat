@echo off
chcp 65001 >nul
SETLOCAL

echo.
echo ========================================
echo   Netlify 部署构建工具
echo ========================================
echo.

:: 检查是否在项目根目录
if not exist "frontend" (
    echo ❌ 错误：未找到frontend目录！
    echo    请在项目根目录运行此脚本
    pause
    exit /b 1
)

echo ✅ 当前位置：%CD%
echo.

:: 进入frontend目录
cd frontend

echo ========================================
echo   第1步：安装依赖
echo ========================================
echo.

call npm install

if %ERRORLEVEL% NEQ 0 (
    echo ❌ 依赖安装失败！
    cd ..
    pause
    exit /b 1
)

echo ✅ 依赖安装成功！
echo.

echo ========================================
echo   第2步：构建生产版本
echo ========================================
echo.

call npm run build

if %ERRORLEVEL% NEQ 0 (
    echo ❌ 构建失败！请检查错误信息
    cd ..
    pause
    exit /b 1
)

echo ✅ 构建成功！
echo.

:: 返回根目录
cd ..

echo ========================================
echo   第3步：检查构建输出
echo ========================================
echo.

if exist "frontend\dist\index.html" (
    echo ✅ 找到 index.html
) else (
    echo ❌ 未找到 index.html
)

if exist "frontend\dist\assets" (
    echo ✅ 找到 assets 目录
) else (
    echo ❌ 未找到 assets 目录
)

echo.
echo ========================================
echo   🎉 构建完成！
echo ========================================
echo.
echo 📦 部署包位置：%CD%\frontend\dist
echo.
echo 📝 下一步操作：
echo    1. 访问：https://app.netlify.com/drop
echo    2. 拖拽 frontend\dist 文件夹到页面
echo    3. 等待上传完成
echo    4. 获取你的部署URL！
echo.
echo 💡 提示：
echo    - 你也可以拖拽整个项目根目录（已包含netlify.toml配置）
echo    - 或者从GitHub仓库自动部署（推荐！）
echo.
echo 📖 详细指南：查看 NETLIFY_DEPLOY_GUIDE.md
echo.

:: 打开dist目录（可选）
SET /P OPEN_FOLDER="要打开dist文件夹吗？(Y/N): "
if /i "%OPEN_FOLDER%"=="Y" (
    explorer frontend\dist
)

echo.
pause
ENDLOCAL

