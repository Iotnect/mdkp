# Getting started

## Design demo (no PHP or database required)

Install Node.js 24, then run:

```sh
npm ci
npm run dev:demo
```

Open the address printed in the terminal and use your assigned demo credentials. Login is simulated. All captures are sample data, and review changes are saved only in the current browser. Use **Settings → Reset demo data** to restore the samples.

To build and preview the static demo:

```sh
npm run build:demo
npm run preview:demo
```

For Vercel, import this Git repository as a new project. Keep the root directory at the repository root, use the **Vite** preset, and deploy. The included `vercel.json` sets the install command to `npm ci`, the build command to `npm run build:demo`, and the output directory to `dist`. No environment variables or database are required for this demo. Choose Node.js 24 in project settings.

The demo login does not protect confidential data. Use sample data only.

## Full application

## Requirements

- PHP 8.5 and Composer 2.
- PHP SQLite support, including PDO SQLite.
- Node.js 24 and npm for the React/TypeScript frontend.

## First-time setup

Open a terminal in the project directory. For a fresh checkout, run:

```powershell
composer install
Copy-Item .env.example .env
php artisan key:generate
php -r "file_exists('database/database.sqlite') || touch('database/database.sqlite');"
php artisan migrate
php artisan db:seed --class=AdminUserSeeder
php artisan db:seed --class=DetectionSeeder
npm ci
npm run build
```

On macOS or Linux, use `cp .env.example .env` instead of `Copy-Item`.

Keep `DB_CONNECTION=sqlite` in `.env`. Build the frontend before starting the system.

## Start the system

```sh
php artisan serve
```

Open **http://127.0.0.1:8000/login** and sign in with your assigned credentials.

To stop the server, press **Ctrl+C** in the terminal.

When editing frontend code, run `npm run dev` in a second terminal for automatic updates. Use `npm run typecheck` to check TypeScript and `npm run build` to create production assets.
