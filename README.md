# Social Media REST API 🚀

A scalable backend service for a social media platform built with **Node.js**, **Express**, and **MongoDB**. This project follows modular architecture and clean code practices, featuring secure authentication and media management.

## 🛠 Features
- **User Management:** Secure signup, login, and email confirmation.
- **Authentication:** JWT-based Auth (Access & Refresh tokens).
- **Media Upload:** Integrated with **Cloudinary** for image/video storage.
- **Security:** Password hashing and data encryption.
- **Mailing System:** Automated emails for account verification.

## 💻 Tech Stack
- **Runtime:** Node.js
- **Framework:** Express.js
- **Database:** MongoDB (Mongoose)
- **Tools:** JWT, Bcrypt, Cloudinary, Nodemailer.

## 🚀 Getting Started

### Prerequisites
- Node.js installed.
- MongoDB instance (Local or Atlas).

### Installation
1. Clone the repository:
   ```bash
   git clone [https://github.com/abdomedht/social-app.git](https://github.com/abdomedht/social-app.git)
2.Install dependencies:
  ```bash
      npm install
3.Create a .env file in the root directory and add your configurations (see below):
   Environment Variables
To run this project, you will need to add the following environment variables to your .env file:

PORT: 3000

DB_URI: Your MongoDB Connection String

HASH_SALT: Password hashing rounds

EMAIL & EMAIL_PASSWORD: For Nodemailer service

CLOUDINARY_CLOUD_NAME, API_KEY, API_SECRET: For media storage

📂 API Documentation & Testing
The project includes a Postman Collection for easy testing.

You can find the collection file in: /docs/socialapp.postman_collection.json

Import it into Postman to see all endpoints (Auth, Posts, Users).
