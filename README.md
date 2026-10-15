# Sri Laxmi Boutiques — Full-Stack E-Commerce App

A boutique dress shop app: JWT authentication, admin/user roles, product
uploads with images, favorites, and star reviews.

## Stack
- **Backend:** Python, FastAPI, PostgreSQL (SQLAlchemy), JWT auth, Cloudinary for image uploads
- **Frontend:** React (Vite), React Router, Axios

## Features
- JWT login/register with role-based access control (`admin` / `user`)
- Admin: add/edit/delete products (name, description, price, **color**, category, image upload)
- Users: browse products, **search by color or keyword**, like/favorite items, view a dedicated Favorites page, leave a 1–5 star rating + review
- One admin account is auto-created on first run from your `.env` file

---

## 1. Backend setup

### Prerequisites
- Python 3.10+
- PostgreSQL installed and running locally
- A free [Cloudinary](https://cloudinary.com/users/register/free) account (for image uploads) — grab your Cloud Name, API Key, and API Secret from the Cloudinary dashboard

### Steps

```bash
cd backend
python3 -m venv venv
source venv/bin/activate        # on Windows: venv\Scripts\activate
pip install -r requirements.txt
```

Create the database:
```bash
createdb boutique_db
# or inside psql: CREATE DATABASE boutique_db;
```

Copy the example env file and fill in your real values:
```bash
cp .env.example .env
```
Edit `.env`:
- `DATABASE_URL` — your local Postgres connection string
- `SECRET_KEY` — any long random string
- `CLOUDINARY_CLOUD_NAME` / `CLOUDINARY_API_KEY` / `CLOUDINARY_API_SECRET` — from your Cloudinary dashboard
- `ADMIN_EMAIL` / `ADMIN_PASSWORD` — the admin login that gets auto-created on first run

Run the server:
```bash
uvicorn app.main:app --reload
```
The API runs at `http://localhost:8000`. Interactive docs at `http://localhost:8000/docs`.

On first run you'll see `Seeded admin account: ...` in the console — log in with that email/password to access the admin dashboard.

---

## 2. Frontend setup

```bash
cd frontend
npm install
npm run dev
```
The app runs at `http://localhost:5173` and talks to the backend at `http://localhost:8000` (configured in `src/api/axios.js`).

---

## 3. Using the app

1. Log in as admin (the seeded account) → go to **Admin** in the nav → add a few dresses with images, colors, and descriptions.
2. Log out, register a normal user account.
3. Browse the shop, search by color or keyword, tap the heart to favorite items, open a product to leave a star rating and review.
4. Check the **Favorites** page to see everything you've saved.

## Notes
- Public registration always creates a `user` role — the `admin` role only exists for the seeded account (create more admins directly in the database if needed).
- Product images are uploaded straight to Cloudinary; if you leave the Cloudinary keys blank, product creation still works but images won't upload.
- CORS is currently locked to `http://localhost:5173` — update `app/main.py` if you deploy the frontend elsewhere.
