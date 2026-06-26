# 👕 Vastra Verse

A modern full-stack MERN e-commerce platform for premium fashion and streetwear. The application includes a customer storefront, an admin dashboard, secure authentication, online payments, wallet functionality, discount campaigns, order management, and more.

---

## 🚀 Features

### Customer

- User Registration & Login (JWT Authentication)
- Browse Products
- Product Search & Filters
- Product Details Page
- Wishlist
- Shopping Cart
- Checkout
- Razorpay Payment Gateway
- Cash on Delivery
- Wallet Payment
- Coupon System
- Order Tracking
- Order History
- User Profile Management
- Product Reviews & Ratings

### Admin

- Secure Admin Login
- Dashboard Analytics
- Product Management
- Category Management
- Brand Management
- Banner Management
- Order Management
- Customer Management
- Coupon Management
- Campaign & Discount Management
- Flash Sales
- Wallet Management
- Sales Reports
- Inventory Management

---

# 🛠 Tech Stack

## Frontend

- React.js
- Vite
- Tailwind CSS
- React Router
- Axios
- React Query (TanStack Query)
- Swiper.js
- Framer Motion

## Backend

- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT Authentication
- Multer
- Cloudinary

## Payments

- Razorpay

## Real-time

- Socket.IO

---

# 📂 Project Structure

```
vastra-verse/
│
├── client/         # Customer Website
├── admin/          # Admin Dashboard
├── server/         # Backend API
│
├── README.md
└── .gitignore
```

---

# 📦 Installation

Clone the repository

```bash
git clone https://github.com/YOUR_USERNAME/vastra-verse.git
```

Move into the project

```bash
cd vastra-verse
```

---

## Install Dependencies

### Client

```bash
cd vastraverse
npm install
```

### Admin

```bash
cd admin
npm install
```

### Server

```bash
cd server
npm install
```

---

# ⚙ Environment Variables

## Server (.env)

```env
PORT=5000

MONGO_URI=

JWT_SECRET=

RAZORPAY_KEY_ID=

RAZORPAY_KEY_SECRET=

CLOUDINARY_NAME=

CLOUDINARY_API_KEY=

CLOUDINARY_API_SECRET=

CLIENT_URL=http://localhost:5173

ADMIN_URL=http://localhost:5174
```

---

## Client (.env)

```env
VITE_API_URL=http://localhost:5000/api
VITE_RAZORPAY_KEY=
```

---

## Admin (.env)

```env
VITE_API_URL=http://localhost:5000/api
```

---

# ▶ Running the Project

## Start Backend

```bash
cd server
npm run dev
```

---

## Start Client

```bash
cd client
npm run dev
```

---

## Start Admin

```bash
cd admin
npm run dev
```

---

# 🌐 Default URLs

| Application | URL |
|-------------|-------------------------|
| Client | http://localhost:5173 |
| Admin | http://localhost:5174 |
| Server API | http://localhost:5000 |

---

# 📸 Screenshots

You can add screenshots here after deployment.

```
Home Page

Admin Dashboard

Product Details

Checkout Page

Order History
```

---

# 📁 Main Modules

- Authentication
- User Management
- Product Management
- Category Management
- Brand Management
- Shopping Cart
- Wishlist
- Coupons
- Wallet
- Razorpay Payments
- Flash Sales
- Discount Campaigns
- Banner Management
- Inventory Management
- Reports & Analytics
- Reviews & Ratings
- Socket.IO Notifications

---

# 🔒 Security

- JWT Authentication
- Password Hashing using bcrypt
- Protected Routes
- Role-based Authorization
- Secure Environment Variables
- Input Validation
- MongoDB Injection Protection

---

# 📈 Future Improvements

- Email Verification
- Forgot Password
- Google Login
- Multi Vendor Support
- AI Product Recommendations
- PWA Support
- Invoice PDF Generation
- Multi-language Support
- SMS Notifications

---

# 🤝 Contributing

1. Fork the repository
2. Create a feature branch

```bash
git checkout -b feature/new-feature
```

3. Commit changes

```bash
git commit -m "Add new feature"
```

4. Push the branch

```bash
git push origin feature/new-feature
```

5. Open a Pull Request

---

# 📄 License

This project is licensed under the MIT License.

---

# 👨‍💻 Author

**Jatin Jethava**

Full Stack MERN Developer

GitHub: https://github.com/YOUR_USERNAME

---

⭐ If you like this project, don't forget to give it a star!
