# Reddetect Frontend

A React + Vite frontend application for Reddetect, configured with Supabase authentication and backend API integration.

## Setup

1. Install dependencies:
   ```bash
   npm install
   ```

2. Create a `.env` file based on `.env.example`:
   ```bash
   cp .env.example .env
   ```

3. Fill in your environment variables in `.env`

## Development

```bash
npm run dev
```

## Build

```bash
npm run build
```

## Environment Variables

- `VITE_SUPABASE_URL`: Supabase project URL
- `VITE_SUPABASE_ANON_KEY`: Supabase anonymous key
- `VITE_API_URL`: Backend API URL
