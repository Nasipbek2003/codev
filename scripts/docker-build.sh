#!/bin/bash

# Скрипт для сборки и запуска Docker контейнеров
# Использование: ./scripts/docker-build.sh [dev|prod]

MODE=${1:-prod}

echo "🐳 Сборка CodevApp в режиме: $MODE"

if [ "$MODE" = "dev" ]; then
    echo "📦 Запуск в режиме разработки..."
    docker-compose -f docker-compose.dev.yml down
    docker-compose -f docker-compose.dev.yml up --build -d
    echo "✅ Разработка запущена на http://localhost:3000"
    echo "📋 Логи: docker-compose -f docker-compose.dev.yml logs -f"
elif [ "$MODE" = "prod" ]; then
    echo "🚀 Запуск в продакшн режиме..."
    docker-compose down
    docker-compose up --build -d
    echo "✅ Продакшн запущен на http://localhost:3000"
    echo "📋 Логи: docker-compose logs -f"
else
    echo "❌ Неизвестный режим: $MODE"
    echo "Использование: ./scripts/docker-build.sh [dev|prod]"
    exit 1
fi

echo "🔧 Полезные команды:"
echo "  Логи:      docker-compose logs -f"
echo "  Остановка: docker-compose down"
echo "  Статус:    docker-compose ps"
