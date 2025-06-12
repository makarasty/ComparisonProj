@echo off
chcp 65001 > nul

rem Запуск клієнтської частини
echo Запускаю клієнтську частину...
cd ./client
if %errorlevel% neq 0 (
    echo Помилка: Не вдалося перейти до директорії client. Перевірте шлях.
    pause
    exit /b %errorlevel%
)
start "Client" cmd /k "npm run dev"
cd ..
echo.

rem Запуск серверної частини
echo Запускаю серверну частину...
cd ./server
if %errorlevel% neq 0 (
    echo Помилка: Не вдалося перейти до директорії server. Перевірте шлях.
    pause
    exit /b %errorlevel%
)
start "Server" cmd /k "npm run dev"
cd ..