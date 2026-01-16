@echo off
chcp 65001 >nul
cls
echo ========================================
echo 🔧 Исправление проблем сборки
echo ========================================
echo.

echo 1️⃣ Обновление Prisma до последней версии...
call npm install --save-dev prisma@latest
call npm install @prisma/client@latest

echo.
echo 2️⃣ Исправление уязвимостей безопасности...
call npm audit fix

echo.
echo 3️⃣ Генерация Prisma Client...
call npx prisma generate

echo.
echo 4️⃣ Очистка кэша...
rmdir /s /q .next 2>nul
rmdir /s /q node_modules\.cache 2>nul

echo.
echo ========================================
echo ✅ Исправления завершены!
echo ========================================
echo.
echo Теперь можно запустить:
echo   npm run dev    - для разработки
echo   npm run build  - для продакшн сборки
echo.
pause
