# SmartMobili — Furniture E-Commerce Platform

A full-stack **furniture e-commerce platform** built with Python and React. Features **multilingual support** (Romanian, Russian, English), **product and category management**, **Cloudinary image storage**, **JWT authentication**, and a fully functional **admin panel**.

🔗 **Live Demo**: [https://smartmobili.vercel.app/]

---

## Features

- **Multilingual Support**: Full UI and product data in Romanian, Russian, and English via i18next and URL-based language routing (`/:lang`)
- **Product Catalog**: Browse products by category with images, descriptions, and pricing
- **Admin Panel**: Manage products, categories, users, and customer inquiries
- **JWT Authentication**: Secure login and registration with role-based access (`user` / `admin`)
- **Cloudinary Image Storage**: Upload and manage images for products and categories
- **Inquiry System**: Customers can submit contact inquiries linked to specific products, with preferred contact method (phone, Telegram, WhatsApp, Viber)
- **Responsive UI**: Built with React 19 and Redux Toolkit for a smooth single-page experience

---

## Tech Stack

**Backend**

- Python 3.11+
- FastAPI + Uvicorn
- SQLAlchemy 2.0 + PostgreSQL
- Cloudinary (image storage)
- JWT authentication (`python-jose` + `passlib`/`bcrypt`)

**Frontend**

- React 19 + TypeScript
- Redux Toolkit
- React Router v7
- Vite
- i18next (internationalization)
- Axios

**Deployment**

- Backend → Render
- Frontend → Vercel
- Database → PostgreSQL (Neon recommended)

---

## Requirements

- Python 3.11+
- Node.js 18+
- PostgreSQL database
- Cloudinary account (for image storage)

---

## Installation

### 1. Clone the repository

```bash
git clone https://github.com/yourusername/smartmobili.git
cd smartmobili
```

### 2. Backend setup

```bash
cd backend
pip install -r requirements.txt
```

Create a `.env` file in the `backend` directory:

```env
DATABASE_URL=postgresql://user:password@host:port/database
SECRET_KEY=your_jwt_secret_key
CLOUD_NAME=your_cloudinary_cloud_name
CLOUD_API_KEY=your_cloudinary_api_key
CLOUD_API_SECRET=your_cloudinary_api_secret
```

### 3. Frontend setup

```bash
cd frontend
npm install
```

Create a `.env` file in the `frontend` directory:

```env
VITE_API_URL=http://localhost:8000
```

---

## Usage

### Start the backend

```bash
cd backend
python main.py
```

The API will be available at `http://localhost:8000`.  
Interactive API docs available at `http://localhost:8000/docs`.

### Start the frontend

```bash
cd frontend
npm run dev
```

The app will be available at `http://localhost:5173`.

---

## Project Structure

```
smartmobili/
│
├── backend/
│   ├── main.py                 # App entry point + DB table creation
│   ├── db.py                   # SQLAlchemy engine + session
│   ├── utils.py                # JWT helpers, translation utils, role enum
│   ├── cloud_storage.py        # Cloudinary upload/delete
│   ├── requirements.txt        # Python dependencies
│   ├── db_models/
│   │   ├── auth.py             # User + UserData SQLAlchemy models
│   │   ├── categories.py       # Category, CategoryTranslation, CategoryImage models
│   │   ├── items.py            # Item, ItemTranslation, ItemImage models
│   │   └── inquiries.py        # Inquiry SQLAlchemy model
│   ├── models/
│   │   ├── auth.py             # Auth Pydantic schemas
│   │   ├── categories.py       # Category Pydantic schemas
│   │   ├── items.py            # Item Pydantic schemas
│   │   └── inquiries.py        # Inquiry Pydantic schemas
│   └── routers/
│       ├── auth.py             # Auth routes
│       ├── categories.py       # Category routes
│       ├── items.py            # Item routes
│       └── inquiries.py        # Inquiry routes
│
├── frontend/
│   └── src/
│       ├── main.tsx            # React root + Redux Provider + Router
│       ├── api.ts              # Axios config with JWT interceptor
│       ├── router/             # React Router configuration
│       ├── components/
│       │   ├── App.tsx         # Root layout with Header and Footer
│       │   ├── Header/
│       │   ├── Footer/
│       │   ├── Catalog/        # Product listing and detail pages
│       │   ├── Carousel/       # Hero carousel and banners
│       │   ├── Admin/          # Admin panel (items, categories, users, inquiries)
│       │   ├── Auth/           # Login and signup forms
│       │   └── Contact/        # Contact/inquiry form
│       ├── store/
│       │   ├── slices/         # Redux slices (auth, catalog, admin, system)
│       │   └── thunks/         # Async API thunks
│       └── i18n/
│           └── locales/        # Translation files (ro, ru, en)
│
├── .gitignore
└── README.md
```

---

## API Endpoints

All endpoints are prefixed with `/api/v1`.

### Auth

| Method   | Endpoint                | Description                    |
| -------- | ----------------------- | ------------------------------ |
| `POST`   | `/auth/register`        | Register a new user            |
| `POST`   | `/auth/login`           | Log in and receive a JWT token |
| `GET`    | `/auth/users/me`        | Get current user profile       |
| `GET`    | `/auth/users`           | List all users (admin only)    |
| `PUT`    | `/auth/users/{user_id}` | Update a user (admin only)     |
| `DELETE` | `/auth/users/{user_id}` | Delete a user (admin only)     |

### Items

| Method   | Endpoint                             | Description                                                    |
| -------- | ------------------------------------ | -------------------------------------------------------------- |
| `GET`    | `/items`                             | List products (supports pagination, category filter, language) |
| `GET`    | `/items/{item_id}`                   | Get a single product with translations and images              |
| `POST`   | `/items`                             | Create a new product                                           |
| `PUT`    | `/items/{item_id}`                   | Update product price or category                               |
| `DELETE` | `/items/{item_id}`                   | Delete a product                                               |
| `POST`   | `/items/{item_id}/images`            | Upload product images                                          |
| `DELETE` | `/items/{item_id}/images/{image_id}` | Delete a product image                                         |
| `PUT`    | `/items/{item_id}/translations`      | Update or create product translations                          |

### Categories

| Method   | Endpoint                                      | Description                            |
| -------- | --------------------------------------------- | -------------------------------------- |
| `GET`    | `/categories`                                 | List all categories with item counts   |
| `GET`    | `/categories/{category_id}`                   | Get a single category                  |
| `POST`   | `/categories`                                 | Create a category                      |
| `PUT`    | `/categories/{category_id}`                   | Update a category                      |
| `PUT`    | `/categories/{category_id}/translations`      | Update or create category translations |
| `POST`   | `/categories/{category_id}/images`            | Upload category images                 |
| `DELETE` | `/categories/{category_id}/images/{image_id}` | Delete a category image                |

### Inquiries

| Method   | Endpoint                  | Description                        |
| -------- | ------------------------- | ---------------------------------- |
| `POST`   | `/inquiries`              | Submit a customer inquiry          |
| `GET`    | `/inquiries`              | List all inquiries with pagination |
| `GET`    | `/inquiries/{inquiry_id}` | Get a single inquiry               |
| `PUT`    | `/inquiries/{inquiry_id}` | Update an inquiry                  |
| `DELETE` | `/inquiries/{inquiry_id}` | Delete an inquiry                  |

---

## Database Schema

### `users`

| Field             | Type        | Description            |
| ----------------- | ----------- | ---------------------- |
| `id`              | integer     | Primary key            |
| `username`        | string(50)  | Unique username        |
| `hashed_password` | string(255) | Bcrypt-hashed password |
| `user_role`       | string(25)  | `user` or `admin`      |
| `signup_at`       | datetime    | Registration timestamp |

### `categories`

| Field  | Type        | Description     |
| ------ | ----------- | --------------- |
| `id`   | integer     | Primary key     |
| `slug` | string(100) | Unique URL slug |

### `category_translations`

| Field         | Type        | Description                         |
| ------------- | ----------- | ----------------------------------- |
| `id`          | integer     | Primary key                         |
| `category_id` | integer     | Foreign key → categories            |
| `language`    | string(2)   | Language code (`ro`, `ru`, `en`)    |
| `name`        | string(100) | Category name in the given language |

### `items`

| Field         | Type     | Description              |
| ------------- | -------- | ------------------------ |
| `id`          | integer  | Primary key              |
| `price`       | float    | Product price            |
| `category_id` | integer  | Foreign key → categories |
| `created_at`  | datetime | Creation timestamp       |

### `item_translations`

| Field         | Type        | Description                      |
| ------------- | ----------- | -------------------------------- |
| `id`          | integer     | Primary key                      |
| `item_id`     | integer     | Foreign key → items              |
| `language`    | string(2)   | Language code (`ro`, `ru`, `en`) |
| `title`       | string(200) | Product title                    |
| `description` | text        | Product description              |

### `item_images` / `category_images`

| Field                     | Type        | Description          |
| ------------------------- | ----------- | -------------------- |
| `id`                      | integer     | Primary key          |
| `item_id` / `category_id` | integer     | Foreign key          |
| `image_url`               | string(500) | Cloudinary image URL |
| `order`                   | integer     | Display order        |

### `inquiries`

| Field                             | Type        | Description                    |
| --------------------------------- | ----------- | ------------------------------ |
| `id`                              | integer     | Primary key                    |
| `name`                            | string(25)  | Customer name                  |
| `subject`                         | string(100) | Inquiry subject                |
| `description`                     | text        | Inquiry details                |
| `item_id`                         | integer     | Foreign key → items (nullable) |
| `user_id`                         | integer     | Foreign key → users (nullable) |
| `phone`                           | string(25)  | Contact phone number           |
| `email`                           | string(100) | Contact email                  |
| `telegram` / `whatsapp` / `viber` | boolean     | Preferred contact methods      |
| `created_at`                      | datetime    | Submission timestamp           |

---

## Multilingual Support

The platform supports **Romanian**, **Russian**, and **English**. Language is selected via the URL prefix (`/ro`, `/ru`, `/en`) and defaults to Romanian. Product and category names and descriptions are stored per-language in the database, and the API accepts a `language` query parameter to return the appropriate translations.

---

## License

This project is open source and available for personal and educational use.
