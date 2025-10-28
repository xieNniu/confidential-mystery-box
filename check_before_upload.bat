@echo off
chcp 65001 >nul
echo ================================================
echo   Pre-Upload Security Check
echo ================================================
echo.

set ISSUES_FOUND=0

echo 🔍 Checking for sensitive files...
echo.

REM Check for .env file
if exist ".env" (
    echo ⚠️  WARNING: .env file found!
    echo    → This file contains private keys and MUST NOT be uploaded
    echo    → It should be in .gitignore
    echo.
    set /a ISSUES_FOUND+=1
)

REM Check for deployment files
if exist "deployment_fhe.json" (
    echo ⚠️  WARNING: deployment_fhe.json found!
    echo    → This file may contain sensitive addresses
    echo    → It should be in .gitignore
    echo.
    set /a ISSUES_FOUND+=1
)

if exist "deployment_simple.json" (
    echo ⚠️  WARNING: deployment_simple.json found!
    echo    → This file may contain sensitive addresses
    echo    → It should be in .gitignore
    echo.
    set /a ISSUES_FOUND+=1
)

REM Check for node_modules
if exist "node_modules" (
    echo ℹ️  node_modules folder found
    echo    → This should be in .gitignore (usually okay)
    echo.
)

REM Check if .gitignore exists
if not exist ".gitignore" (
    echo ❌ ERROR: .gitignore file not found!
    echo    → This file is required to prevent uploading sensitive files
    echo.
    set /a ISSUES_FOUND+=1
) else (
    echo ✅ .gitignore file exists
)

REM Check if env.example exists
if not exist "env.example" (
    echo ⚠️  WARNING: env.example not found!
    echo    → This file should contain configuration template
    echo.
    set /a ISSUES_FOUND+=1
) else (
    echo ✅ env.example file exists
)

REM Check hardhat.config.js for hardcoded keys
if exist "hardhat.config.js" (
    findstr /C:"0x4488b744123dfb0d60b4744c2791e1865343ff5783f35e7308718815661ba1e8" "hardhat.config.js" >nul 2>&1
    if %ERRORLEVEL% EQU 0 (
        echo ⚠️  WARNING: hardhat.config.js may contain a real private key!
        echo    → Please verify it uses environment variables only
        echo.
        set /a ISSUES_FOUND+=1
    ) else (
        echo ✅ hardhat.config.js looks safe
    )
)

REM Search for common sensitive patterns
echo.
echo 🔍 Searching for sensitive patterns in code...
echo.

findstr /S /I /C:"private" /C:"key" /C:"secret" /C:"mnemonic" *.js *.ts *.tsx *.sol 2>nul | findstr /V /C:"PRIVATE_KEY" /C:"// " /C:"privateKey:" /C:"getPrivateKey" /C:"description" >nul 2>&1
if %ERRORLEVEL% EQU 0 (
    echo ⚠️  WARNING: Found potential sensitive data in code files
    echo    → Please manually review your code for hardcoded secrets
    echo.
    set /a ISSUES_FOUND+=1
)

echo.
echo ================================================
echo   Check Complete
echo ================================================
echo.

if %ISSUES_FOUND% EQU 0 (
    echo ✅ No critical issues found!
    echo ✅ Your project appears ready for upload
    echo.
    echo You can now run: upload_to_github.bat
) else (
    echo ⚠️  Found %ISSUES_FOUND% potential issue(s)
    echo.
    echo Please review and fix the issues above before uploading.
    echo.
    echo Need help? Check PRE_UPLOAD_CHECKLIST.md
)

echo.
echo Press any key to exit...
pause >nul

