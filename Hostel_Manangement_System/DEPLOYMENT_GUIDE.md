# Vercel Deployment Guide - HMS Project

This guide explains how to deploy the Hostel Management System to Vercel and ensure the database connection works correctly.

## 1. Prepare Your Database (Supabase)

The project is configured for **Supabase PostgreSQL**. Since Vercel uses serverless functions, you **must** use the Supabase Transaction Pooler.

1.  Go to your **Supabase Dashboard**.
2.  Navigate to **Project Settings** > **Database**.
3.  Scroll down to **Connection Pooler**.
4.  Copy the **Transaction Mode** URL (usually ends with `:6543`).
    *   Example: `postgresql://postgres.[ID]:[PASSWORD]@aws-0-[REGION].pooler.supabase.com:6543/postgres?pgbouncer=true&sslmode=require`

## 2. Configure Vercel Environment Variables

In your Vercel Project Dashboard (`Project Settings` > `Environment Variables`), add the following:

| Key | Value | Description |
| :--- | :--- | :--- |
| `DATABASE_URL` | Your Supabase Pooler URL | The connection string with `:6543` |
| `JWT_SECRET` | A secure random string | Used for signing login tokens |
| `NODE_ENV` | `production` | (Vercel sets this automatically) |

## 3. Deploy to Vercel

### Option A: Via GitHub (Recommended)
1.  Push your changes to GitHub:
    ```bash
    git add .
    git commit -m "Standardize API responses and improve error handling"
    git push origin main
    ```
2.  Connect your repo to Vercel.
3.  Vercel will detect the `postinstall` script and automatically run `prisma generate`.

### Option B: Via Vercel CLI
```bash
vercel --prod
```

## 4. Troubleshooting Connection Issues

> [!IMPORTANT]
> **If you see "Database connection failed" on Vercel:**
> 1. Double-check that your `DATABASE_URL` ends with `:6543` (Port 6543 is for the pooler).
> 2. Ensure `?pgbouncer=true` is appended to the URL.
> 3. Verify that your Supabase password doesn't contain special characters that need URL encoding (e.g., `#`, `@`, `:`) or ensure they are properly encoded.

## 5. Verify Successful Deployment
1.  Navigate to your Vercel deployment URL.
2.  Try logging in with the demo credentials:
    *   **Admin**: `admin@hms.com` / `admin123`
    *   **Warden**: `warden@hms.com` / `warden123`
3.  Since Vercel is in the cloud, it will **not** be blocked by your college WiFi!
