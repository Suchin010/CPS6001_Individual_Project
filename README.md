# Expense Tracker Web Application

## Overview
This is a web-based personal expense tracker that allows users to record income and expenses, categorize transactions, and visualize spending patterns through interactive charts. The application is designed to improve financial awareness using a simple and user-friendly interface.

## Features
- Login system (local authentication)
- Add and delete transactions
- Expense categorization (Food, Travel, Necessities, Unwanted)
- Automatic GBP currency formatting
- Dashboard with charts:
  - Income vs Expense
  - Category-based spending
- Monthly filtering
- Smart insights and spending warnings
- Export data to CSV
- Clear all stored data
- Responsive layout

## How to Run (Using PyCharm)

1. Open PyCharm.
2. Click **Open** and select the project folder (`expense-tracker`).
3. Make sure all files are inside the project:
   - `login.html`
   - `index.html`
   - `style.css`
   - `script.js`

4. Right-click on `login.html`  
   → Select **Open in Browser** (or use the browser icon in the top-right corner).

5. Alternatively, install the **Live Server plugin** (recommended):
   - Go to **Settings → Plugins**
   - Search for **Live Server**
   - Install and restart PyCharm
   - Right-click `login.html` → **Open with Live Server**

## Login Credentials
- Username: `admin`
- Password: `1234`

## Notes
- All data is stored locally using browser localStorage.
- No database or backend server is required.
- Works entirely on the frontend.
- Best viewed in modern browsers (Chrome recommended).
