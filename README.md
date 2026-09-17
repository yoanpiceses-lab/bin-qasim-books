# Bin Qasim Books & Uniforms

A full-stack e-commerce website for **Bin Qasim Books & Uniforms**, built to provide customers with an easy way to browse products and place orders online.

## Features

### Customer Storefront

* Browse available products
* Browse products by category
* View product details
* Search for products
* Add products to cart
* Update cart quantities
* Remove products from cart
* Place orders
* Responsive design for desktop, tablet, and mobile

### Admin Dashboard

* Secure admin login
* Add new products
* Edit existing products
* Delete products
* Update product prices
* Change product images
* Manage product categories
* View and manage orders
* Manage store settings

### Database & Storage

* Persistent product and order data
* Supabase database
* Supabase Storage for product images

## Tech Stack

### Frontend

* React
* Vite
* TypeScript

### Backend

* Node.js
* Express
* TypeScript

### Database & Storage

* Supabase

## Project Structure

```text
bin-qasim-books/
├── src/
│   ├── components/
│   ├── pages/
│   └── ...
├── server.ts
├── package.json
├── vite.config.ts
└── README.md
```

## Running Locally

### 1. Clone the repository

```bash
git clone <repository-url>
cd bin-qasim-books
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure environment variables

Create the required environment file and add the Supabase configuration used by the application.

Do not commit private keys, passwords, or service-role credentials to the repository.

### 4. Start the development server

```bash
npm run dev
```

## Production Build

To create a production build:

```bash
npm run build
```

The project builds the frontend and prepares the Node.js/Express backend for production deployment.

## Deployment

The application can be deployed using separate services for the frontend and backend.

* **Frontend:** Netlify or another static hosting provider
* **Backend:** Node.js-compatible hosting such as Render
* **Database & Storage:** Supabase

Environment variables must be configured on the deployment platform.

## Security

Sensitive credentials and environment variables should never be committed to GitHub.

The `.env` and other environment-specific files should remain private.

## Project Status

The website is actively being developed and may receive additional improvements and features.

---

**Bin Qasim Books & Uniforms**

