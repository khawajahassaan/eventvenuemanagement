# VenueSync Backend — Laravel 11 + MySQL (XAMPP)

## Prerequisites
- XAMPP installed and running (Apache + MySQL)
- Composer installed
- PHP 8.2 (comes with XAMPP)

## Setup Steps

### Step 1 — Start XAMPP
Open XAMPP Control Panel and start **Apache** and **MySQL**

### Step 2 — Create Database
Open browser → go to **http://localhost/phpmyadmin**
Click **New** → type `venuesync` → click **Create**

### Step 3 — Extract this ZIP
Extract to your Desktop or any folder

### Step 4 — Configure .env
Copy `.env.example` to `.env` and set your DB password:
```
DB_PASSWORD=        ← leave blank if XAMPP default (no password)
DB_PASSWORD=root    ← or whatever you set during MySQL install
```
Also set:
```
FRONTEND_URL=http://localhost:5173
```

### Step 5 — Run Setup
Double-click **SETUP.bat** — it does everything automatically:
- composer install
- key:generate
- jwt:secret
- migrate
- db:seed
- storage:link

### Step 6 — Start the API
```cmd
php artisan serve
```
API runs at: **http://localhost:8000/api**

### Step 7 — Connect Frontend
In your frontend project open `src/api/client.ts` and set:
```ts
const BASE_URL = "http://localhost:8000/api";
```

## Demo Accounts
| Role    | Email                | Password    |
|---------|----------------------|-------------|
| Admin   | admin@venuesync.pk   | password123 |
| Owner   | owner@venuesync.pk   | password123 |
| Planner | planner@venuesync.pk | password123 |

## Troubleshooting
| Error | Fix |
|-------|-----|
| `composer install` fails | Make sure Composer is installed |
| Migration fails | Check XAMPP MySQL is running + database exists |
| `php not found` | Add XAMPP PHP to PATH: `C:\xampp\php` |
| CORS error in browser | Check FRONTEND_URL in .env matches your frontend port |
