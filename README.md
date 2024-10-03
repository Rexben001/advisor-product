# Advisor-Product Management API

This is a RESTful backend API built using **Node.js**, **Express**, and **Sequelize**. The API provides endpoints for advisor onboarding (registration and login), and product management, where advisors can create and list their own products. Authentication is handled using **JWT**.

## **Features**

-   Advisor registration and login with **JWT** authentication.
-   Advisors can create products and list only their own products.
-   Validation of input data using **zod**.

## **Installation**

1. **Clone the repository**:

```bash
git clone https://github.com/yourusername/advisor-product-api.git
cd advisor-product-api
```

2. **Install dependencies**:

```bash
npm install
```

3. Create a .env file: Create a .env file in the root directory of the project and configure the following environment variables:

```bash
cp .env.example .env
```

## **Running in Development**

To run the app in development mode with live reload using nodemon:

```bash
npm run dev
```

To run the tests, use the following command:

```bash
npm t
```

## **API Docs**

Postman Collections: https://documenter.getpostman.com/view/5770396/2sAXxLAtTq

request

## Technologies Used

Node.js: JavaScript runtime for building scalable applications.
Express.js: Web framework for creating RESTful APIs.
Sequelize: ORM for interacting with the database.
SQLite: Database used for simplicity (can be easily replaced with PostgreSQL, MySQL, etc.).
JWT: JSON Web Token for authentication.
bcryptjs: Password hashing.
Zod: Input validation
jest & supertest: Used for testing.
