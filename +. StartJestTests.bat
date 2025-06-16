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

call check_mongo.bat
if %errorlevel% neq 0 (
    echo.
    echo �������� MongoDB ����������� � ��������. ��������� ����� ��������.
    pause
    exit /b %errorlevel%
)
echo.
echo �������� MongoDB ������ ���������.


cd tests
if %errorlevel% neq 0 (
    echo �������: �� ������� ������� �� �������� tests. �������� ����.
    pause
    exit /b %errorlevel%
)
call npm run test
if %errorlevel% neq 0 (
    echo.
    echo �������: ��������� ����� ����������� � ��������.
    pause
    exit /b %errorlevel%
)

echo.
echo ����� ������ ���������.
pause
endlocal