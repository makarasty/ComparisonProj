@echo off
chcp 65001 > nul
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

set "PROJECT_DIRS=client server tests"

for %%d in (%PROJECT_DIRS%) do (
    echo.
    echo Переходжу до директорії "%%d" та запускаю "npm install"...
    cd "%%d"

    if %errorlevel% neq 0 (
        echo Помилка: Не вдалося перейти до директорії "%%d". Перевірте шлях або структуру проекту.
        pause
        exit /b %errorlevel%
    )

    call npm install
    if %errorlevel% neq 0 (
        echo Помилка: "npm install" завершився з помилкою у "%%d".
        echo Будь ласка, перевірте вивід npm для детальної інформації.
        pause
        exit /b %errorlevel%
    )

    echo "npm install" успішно завершено у "%%d".
    cd ..
)

echo.
echo Встановлення всіх залежностей завершено.
pause
endlocal