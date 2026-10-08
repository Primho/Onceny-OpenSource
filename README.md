# Onceny

Onceny is a focused workspace for turning ideas, notes, and lightweight planning into organized spaces. It combines a fast React interface with a Flask API and a shared PostgreSQL database so work remains available across devices.

## Product Overview

- Create and organize spaces, pages, and content blocks.
- Use text, headings, subheadings, and task blocks.
- Reorder and edit content without losing ownership boundaries.
- Authenticate with a personal account.
- Store production data centrally in PostgreSQL through Supabase.

## Architecture

```text
React + Vite (Vercel)
	|
	v
Flask + Gunicorn (Render)
	|
	v
PostgreSQL (Supabase)
```

The frontend uses same-origin `/api` requests in production. Vercel rewrites those requests to the Render API, which keeps authentication cookies reliable in browsers with strict cross-site privacy policies.

## Repository Structure

```text
backend/          Flask application, authentication, routes, and database layer
frontend/         React + Vite application
requirements.txt  Python production dependencies
```

## Local Development

### Backend

```bash
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
gunicorn --chdir backend app:app
```

The local backend uses SQLite when `DATABASE_URL` is not set. It listens on `http://127.0.0.1:5000`.

### Frontend

```bash
cd frontend
npm install
npm run dev
```

Vite proxies `/api` requests to the local Flask server. Open `http://localhost:5173`.

## Production Configuration

### Render

Use a Python Web Service with:

```text
Build Command: pip install -r requirements.txt
Start Command: gunicorn --chdir backend app:app
```

Required environment variables:

```text
DATABASE_URL=Supabase PostgreSQL connection string
SECRET_KEY=long random secret
FRONTEND_URL=https://onceny.vercel.app
```

### Vercel

Set the project root to `frontend`. The included `frontend/vercel.json` rewrites `/api` to the Render service. Use:

```text
Build Command: npm run build
Output Directory: dist
Install Command: npm install
```

## Validation

```bash
cd frontend
npm run lint
npm run build
```

```bash
python3 -m py_compile backend/app.py backend/models.py backend/auth_helpers.py backend/routes/*.py
```

## Security Notes

- Keep `DATABASE_URL` and `SECRET_KEY` in the hosting provider's secret environment variables.
- Never commit passwords, tokens, `.env` files, or local database files.
- Keep production CORS restricted to the deployed frontend origin.

## License

This project is currently maintained as a private application. Licensing terms can be added here when the project is made public.

This is the first log :O
