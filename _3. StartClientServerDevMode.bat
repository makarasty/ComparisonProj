@echo off
chcp 1251 > nul
setlocal enabledelayedexpansion

echo ������� ���������: %CD%
echo.

echo ������� �������� ���������� ��������...
call check_env.bat
if errorlevel 1 (
    echo �������� ���������� ����������� � ��������.
    pause
    exit /b 1
)
echo �������� ���������� ������ ���������.
echo.

echo ������� �������� MongoDB...
call check_mongo.bat
if errorlevel 1 (
    echo �������� MongoDB ����������� � ��������.
    pause
    exit /b 1
)
echo �������� MongoDB ������ ���������.
echo.

echo �������� �������� ��������� �������...
if not exist "client" (
    echo �������: ��������� "client" �� ��������!
    pause
    exit /b 1
)
if not exist "server" (
    echo �������: ��������� "server" �� ��������!
    pause
    exit /b 1
)
echo �������� "client" �� "server" �������.
echo.

echo �������� node_modules � client...
if not exist "client\node_modules" (
    echo �������: node_modules ������� � client. ��������� "npm install" � �������� client.
    pause
    exit /b 1
)
echo node_modules �������� � client.

echo �������� node_modules � server...
if not exist "server\node_modules" (
    echo �������: node_modules ������� � server. ��������� "npm install" � �������� server.
    pause
    exit /b 1
)
echo node_modules �������� � server.
echo.

echo �������� �볺������ �������...
pushd client
start "Client" cmd /k "npm run dev"
popd

echo �������� �������� �������...
pushd server
start "Server" cmd /k "npm run dev"
popd

echo.
echo ����� ������� ���������� �������.
pause