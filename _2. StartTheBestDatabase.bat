@echo off
chcp 1251 > nul
setlocal

set "SCRIPT_DIR=%~dp0"

set "MONGODB_PATH=%SCRIPT_DIR%mongo"
set "DB_PATH=%MONGODB_PATH%\data"

if not exist "%DB_PATH%" (
    echo ������� ��������� ��� ����� MongoDB: "%DB_PATH%"
    mkdir "%DB_PATH%"
)

echo �������� MongoDB � ����� ����� � "%DB_PATH%"
start "MongoIsTheBest" "%MONGODB_PATH%\mongod.exe" --dbpath "%DB_PATH%"