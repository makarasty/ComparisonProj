@echo off
chcp 1251 > nul

rem Файл: check_mongo.bat
rem Перевіряє, чи запущена MongoDB на стандартному порту 27017.
rem Повертає 0 при успіху, 1 при помилці.

echo.
echo Перевіряю, чи запущена MongoDB на порту 27017...
netstat -an | findstr ":27017" | findstr "LISTENING" > nul

if %errorlevel% neq 0 (
    echo.
    echo Помилка: MongoDB не запущена на порту 27017.
    echo Будь ласка, запустіть MongoDB вручну або за допомогою окремого скрипта.
    exit /b 1
) else (
    echo.
    echo MongoDB успішно працює на порту 27017.
    exit /b 0
)