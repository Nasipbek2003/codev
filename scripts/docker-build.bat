@echo off
REM Скрипт для сборки и запуска Docker контейнеров на Windows
REM Использование: scripts\docker-build.bat [dev|prod]

set MODE=%1
if "%MODE%"=="" set MODE=prod

echo 🐳 Сборка CodevApp в режиме: %MODE%

if "%MODE%"=="dev" (
    echo 📦 Запуск в режиме разработки...
    docker-compose -f docker-compose.dev.yml down
    docker-compose -f docker-compose.dev.yml up --build -d
    echo ✅ Разработка запущена на http://localhost:3000
    echo 📋 Логи: docker-compose -f docker-compose.dev.yml logs -f
) else if "%MODE%"=="prod" (
    echo 🚀 Запуск в продакшн режиме...
    docker-compose down
    docker-compose up --build -d
    echo ✅ Продакшн запущен на http://localhost:3000
    echo 📋 Логи: docker-compose logs -f
) else (
    echo ❌ Неизвестный режим: %MODE%
    echo Использование: scripts\docker-build.bat [dev^|prod]
    exit /b 1
)

echo 🔧 Полезные команды:
echo   Логи:      docker-compose logs -f
echo   Остановка: docker-compose down
echo   Статус:    docker-compose ps
