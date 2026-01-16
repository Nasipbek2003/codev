@echo off
chcp 65001 >nul
cls
echo ========================================
echo 🔄 Переустановка зависимостей
echo ========================================
echo.

echo 1️⃣ Удаление node_modules и lock файла...
rmdir /s /q node_modules 2>nul
del package-lock.json 2>nul
rmdir /s /q .next 2>nul

echo.
echo 2️⃣ Установка зависимостей...
call npm install

echo.
echo 3️⃣ Генерация Prisma Client...
call npx prisma generate

echo.
echo ========================================
echo ✅ Переустановка завершена!
echo ========================================
echo.
echo Теперь можно запустить:
echo   npm run dev    - для разработки
echo   npm run build  - для продакшн сборки
echo.
pause
