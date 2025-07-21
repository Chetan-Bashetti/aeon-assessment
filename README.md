# AEON Assessment

## Project Structure

- `apps/api/` - Node.js/Express backend API
- `apps/web/` - Next.js frontend application

## Task 1: Navigation Bar

- The app features a navigation bar at the top of the UI.
- The navigation bar includes a **Login** option.
- Clicking **Login** navigates the user to the authentication flow (see Task 2).
- Is have media query, Compatible with mobile and Desktop device
- In mobile view user can see the toggle icons for hamburger and close for Appropriate actions

## Task 2: Authentication Flow

- The authentication flow implements a secure, multi-step login process:
  1. **Username Input:** User enters their username.
  2. **Secure Word:** A secure word is generated and displayed, with expiry and rate limiting.
  3. **Password Input:** User enters their password, which is hashed before sending to the backend.
  4. **Login API:** Credentials and secure word are validated; a token is returned on success.
  5. **MFA Step:** User enters a 6-digit code (TOTP or simulated), verified by the backend.
  6. **Success:** On successful MFA, the user is logged in and can access the dashboard.
- The authentication flow is accessible by clicking **Login** in the navigation bar.

## Task 3: Dashboard (Transactions Table)

- After successful login, the user is redirected to the **Dashboard** page.
- The dashboard displays a table of transactions.
- Transaction data is fetched from the backend `/transactions` API (serving static JSON data).
- The table includes columns for Date, Reference ID, Recipient, Transaction Type, and Amount.
- Only authenticated users (with a valid token in localStorage) can access the dashboard; others are redirected to login.

---

## Getting Started

**To run the app:**

1. Install dependencies: `npm install`
2. Start the backend and frontend: `npm run dev`
3. Use the navigation bar to access login and dashboard features as described above.
