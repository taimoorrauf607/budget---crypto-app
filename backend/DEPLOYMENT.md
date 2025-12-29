# Backend Deployment Instructions (Render + Supabase)

Follow these steps to deploy your API to Render.

## 1. Setup Supabase
1. Go to [Supabase](https://supabase.com/) and create a new project.
2. In the **SQL Editor**, paste the contents of `backend/schema.sql` and run it to create your tables.
3. Go to **Project Settings** -> **API**.
4. Copy your `Project URL` (this is your `SUPABASE_URL`).
5. Copy your `anon public` key (this is your `SUPABASE_KEY`).

## 2. Deploy to Render
1. Create a GitHub repository and push your project code (including the `backend` folder).
2. Create a new **Web Service** on [Render](https://render.com/).
3. Connect your GitHub repository.
4. Set the following configurations:
   - **Environment**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `node index.js`
5. In the **Environment Variables** section, add:
   - `SUPABASE_URL`: (Your project URL from Supabase)
   - `SUPABASE_KEY`: (Your anon key from Supabase)
   - `PORT`: `5000`
6. Click **Create Web Service**.

## 3. Environment Variables
Ensure you never commit your actual `.env` file to GitHub. Use the variables in Render's dashboard for security.
