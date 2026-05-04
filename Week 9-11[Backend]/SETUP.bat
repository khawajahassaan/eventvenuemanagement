@echo off
echo =====================================================
echo  VenueSync Backend Setup (XAMPP)
echo =====================================================
echo.

echo [1/6] Installing Laravel packages...
call composer install
if %errorlevel% neq 0 (
    echo ERROR: composer install failed. Make sure Composer is installed.
    pause
    exit /b 1
)

echo.
echo [2/6] Copying .env file...
if not exist .env copy .env.example .env

echo.
echo [3/6] Generating app key...
call php artisan key:generate

echo.
echo [4/6] Generating JWT secret...
call php artisan jwt:secret --force

echo.
echo [5/6] Running database migrations...
call php artisan migrate --force
if %errorlevel% neq 0 (
    echo.
    echo ERROR: Migration failed!
    echo Make sure:
    echo  1. XAMPP is running (Apache + MySQL)
    echo  2. You created the 'venuesync' database in phpMyAdmin
    echo  3. DB_PASSWORD in .env matches your MySQL password
    echo     (XAMPP default password is blank - leave DB_PASSWORD= empty)
    pause
    exit /b 1
)

echo.
echo [6/6] Seeding demo data...
call php artisan db:seed --force

echo.
echo [7/7] Linking storage...
call php artisan storage:link

echo.
echo =====================================================
echo  SETUP COMPLETE!
echo =====================================================
echo.
echo  Demo accounts:
echo  Admin:   admin@venuesync.pk   / password123
echo  Owner:   owner@venuesync.pk   / password123
echo  Planner: planner@venuesync.pk / password123
echo.
echo  Now run: php artisan serve
echo  API will be at: http://localhost:8000/api
echo =====================================================
pause
