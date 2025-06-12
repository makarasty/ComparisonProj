@echo off
chcp 65001 > nul
setlocal

rem Перевірка наявності Node.js
where node >nul 2>&1
if %errorlevel% neq 0 (
    echo.
    echo Помилка: Node.js не встановлено або не додано до PATH.
    echo Будь ласка, встановіть Node.js з https://nodejs.org/
    pause
    exit /b 1
)

rem Перевірка наявності npm
where npm >nul 2>&1
if %errorlevel% neq 0 (
    echo.
    echo Помилка: npm не встановлено або не додано до PATH.
    echo Зазвичай npm встановлюється разом з Node.js. Перевстановіть Node.js або перевірте його інсталяцію.
    pause
    exit /b 1
)

echo.
echo Node.js та npm успішно перевірено. Продовжую встановлення залежностей.

rem Список директорій для встановлення залежностей
set "PROJECT_DIRS=client server tests"

rem Цикл для кожної директорії
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