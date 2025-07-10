# AEON Assessment

This repository contains the AEON Assessment project, structured as a monorepo with separate API and Web applications.

## Project Structure

- `apps/api/` - Node.js/Express backend API
- `apps/web/` - Next.js frontend application

## Getting Started

1. Install dependencies:
   ```bash
   npm install
   # or
   yarn install
   ```
2. Start the API:
   ```bash
   cd apps/api
   npm start
   ```
3. Start the Web app:
   ```bash
   cd apps/web
   npm run dev
   ```

## Notes

- The API uses mock data for transactions.
- The Web app is styled with custom CSS in `apps/web/styles/`.
