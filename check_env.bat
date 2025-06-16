@echo off
chcp 1251 > nul

rem ����: check_env.bat
rem �������� �������� Node.js �� npm.
rem ������� 0 ��� �����, 1 ��� �������.

where node >nul 2>&1
if %errorlevel% neq 0 (
    echo.
    echo �������: Node.js �� ����������� ��� �� ������ �� PATH.
    echo ���� �����, ��������� Node.js � https://nodejs.org/
    exit /b 1
)

where npm >nul 2>&1
if %errorlevel% neq 0 (
    echo.
    echo �������: npm �� ����������� ��� �� ������ �� PATH.
    echo �������� npm �������������� ����� � Node.js. ������������� Node.js ��� �������� ���� ����������.
    exit /b 1
)

exit /b 0