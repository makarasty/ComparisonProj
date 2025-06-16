@echo off
rem Файл: check_env.bat
rem Перевіряє наявність Node.js та npm.
rem Повертає 0 при успіху, 1 при помилці.

where node >nul 2>&1
if %errorlevel% neq 0 (
    echo.
    echo Помилка: Node.js не встановлено або не додано до PATH.
    echo Будь ласка, встановіть Node.js з https://nodejs.org/
    exit /b 1
)

where npm >nul 2>&1
if %errorlevel% neq 0 (
    echo.
    echo Помилка: npm не встановлено або не додано до PATH.
    echo Зазвичай npm встановлюється разом з Node.js. Перевстановіть Node.js або перевірте його інсталяцію.
    exit /b 1
)

exit /b 0