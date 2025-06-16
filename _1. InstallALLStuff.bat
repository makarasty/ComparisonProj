@echo off
chcp 1251 > nul
setlocal

echo ������� �������� ���������� ��������...
call check_env.bat
if %errorlevel% neq 0 (
    echo.
    echo �������� ���������� ����������� � ��������. ��������� ������� ��������.
    pause
    exit /b %errorlevel%
)
echo.
echo �������� ���������� ������ ���������.

set "PROJECT_DIRS=client server tests"

for %%d in (%PROJECT_DIRS%) do (
    echo.
    echo ��������� �� �������� "%%d" �� �������� "npm install"...
    cd "%%d"

    if %errorlevel% neq 0 (
        echo �������: �� ������� ������� �� �������� "%%d". �������� ���� ��� ��������� �������.
        pause
        exit /b %errorlevel%
    )

    call npm install
    if %errorlevel% neq 0 (
        echo �������: "npm install" ���������� � �������� � "%%d".
        echo ���� �����, �������� ���� npm ��� �������� ����������.
        pause
        exit /b %errorlevel%
    )

    echo "npm install" ������ ��������� � "%%d".
    cd ..
)

echo.
echo ������������ ��� ����������� ���������.
pause
endlocal