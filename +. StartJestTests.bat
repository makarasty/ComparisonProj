@echo off
chcp 1251 > nul
setlocal

echo Виконую перевірку середовища розробки...
call check_env.bat
if %errorlevel% neq 0 (
    echo.
    echo Перевірка середовища завершилася з помилкою. Виконання скрипта зупинено.
    pause
    exit /b %errorlevel%
)
echo.
echo Перевірка середовища успішно завершена.

call check_mongo.bat
if %errorlevel% neq 0 (
    echo.
    echo Перевірка MongoDB завершилася з помилкою. Виконання тестів зупинено.
    pause
    exit /b %errorlevel%
)
echo.
echo Перевірка MongoDB успішно завершена.


cd tests
if %errorlevel% neq 0 (
    echo Помилка: Не вдалося перейти до директорії tests. Перевірте шлях.
    pause
    exit /b %errorlevel%
)
call npm run test
if %errorlevel% neq 0 (
    echo.
    echo Помилка: Виконання тестів завершилося з помилкою.
    pause
    exit /b %errorlevel%
)

echo.
echo Тести успішно завершено.
pause
endlocal