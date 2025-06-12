@echo off
chcp 65001 > nul
setlocal enabledelayedexpansion

echo Поточна директорія: %CD%
echo.

echo Виконую перевірку середовища розробки...
call check_env.bat
if errorlevel 1 (
    echo Перевірка середовища завершилася з помилкою.
    pause
    exit /b 1
)
echo Перевірка середовища успішно завершена.
echo.

echo Виконую перевірку MongoDB...
call check_mongo.bat
if errorlevel 1 (
    echo Перевірка MongoDB завершилася з помилкою.
    pause
    exit /b 1
)
echo Перевірка MongoDB успішно завершена.
echo.

echo Перевіряю наявність директорій проекту...
if not exist "client" (
    echo Помилка: Директорія "client" не знайдена!
    pause
    exit /b 1
)
if not exist "server" (
    echo Помилка: Директорія "server" не знайдена!
    pause
    exit /b 1
)
echo Директорії "client" та "server" знайдені.
echo.

echo Перевіряю node_modules у client...
if not exist "client\node_modules" (
    echo Помилка: node_modules відсутня у client. Виконайте "npm install" у директорії client.
    pause
    exit /b 1
)
echo node_modules знайдено у client.

echo Перевіряю node_modules у server...
if not exist "server\node_modules" (
    echo Помилка: node_modules відсутня у server. Виконайте "npm install" у директорії server.
    pause
    exit /b 1
)
echo node_modules знайдено у server.
echo.

echo Запускаю клієнтську частину...
pushd client
start "Client" cmd /k "npm run dev"
popd

echo Запускаю серверну частину...
pushd server
start "Server" cmd /k "npm run dev"
popd

echo.
echo Обидві частини застосунку запущені.
pause