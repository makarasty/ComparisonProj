@echo off
chcp 1251 > nul

rem ����: check_mongo.bat
rem ��������, �� �������� MongoDB �� ������������ ����� 27017.
rem ������� 0 ��� �����, 1 ��� �������.

echo.
echo ��������, �� �������� MongoDB �� ����� 27017...
netstat -an | findstr ":27017" | findstr "LISTENING" > nul

if %errorlevel% neq 0 (
    echo.
    echo �������: MongoDB �� �������� �� ����� 27017.
    echo ���� �����, �������� MongoDB ������ ��� �� ��������� �������� �������.
    exit /b 1
) else (
    echo.
    echo MongoDB ������ ������ �� ����� 27017.
    exit /b 0
)