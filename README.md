# fullstack-todo-app
A secure full-stack Todo App with React frontend and Flask backend. Features include JWT auth, Google SSO, email notifications, and CRUD for to-dos. Fully responsive UI, database integration, and deployed
# 📝 Full Stack Todo App

A mobile-first, full-stack **Todo App** with:

- 🔐 JWT authentication & Google SSO
- 📬 Email notifications on new todos
- ✅ CRUD operations on todos
- 🌐 Frontend: React + Vite
- 🐍 Backend: Flask + PostgreSQL/MySQL
- ☁️ Deployed using Render / Vercel

---

## 🚀 Features

- 🔐 **Login/Register** with email-password
- 🧑‍💻 **Google Sign-In** integration
- 🗂️ **Create, Read, Update, Delete (CRUD)** Todos
- 📧 **Send email notification** upon new todo creation
- 🎨 Clean and responsive UI
- 🧾 Token stored in localStorage
- ⚙️ Secure API routes with JWT token verification
- 🔁 Logout functionality

---

## 🛠️ Tech Stack

### Frontend:
- `React` (Vite)
- `React Router DOM`
- `Axios`
- `Google OAuth`
- `JWT Token handling`
- `CSS / Tailwind` (optional)

### Backend:
- `Python` & `Flask`
- `Flask-JWT-Extended`
- `Flask-CORS`
- `Flask-Mail`
- `SQLAlchemy`
- `PostgreSQL` / `MySQL`

---

## 🗂️ Project Structure

root/
│
├── client/ # React Frontend
│ ├── src/
│ │ ├── components/ # Login, Register, Todos, etc.
│ │ ├── App.jsx
│ │ └── main.jsx
│ ├── .env
│ └── vite.config.js
│
├── backend/ # Flask Backend
│ ├── app/
│ │ ├── auth.py # Auth blueprint (JWT, Google)
│ │ ├── todo.py # Todo blueprint
│ │ └── models.py
│ ├── app.py # Entry point
│ ├── config.py
│ ├── .env
│ └── requirements.txt
│
└── README.md # ← This file

yaml
Copy
Edit

---

## ⚙️ Setup Instructions

### ✅ Prerequisites
- Node.js ≥ 18
- Python ≥ 3.9
- PostgreSQL or MySQL installed locally or via a cloud DB
- Google OAuth credentials (client ID)
- Email credentials (SMTP for Gmail, Mailtrap etc.)

---

### 🧑‍💻 Backend Setup (`/backend`)

```bash
cd backend
python -m venv venv
source venv/bin/activate  # or venv\Scripts\activate on Windows

pip install -r requirements.txt
Create .env in backend/:

env
Copy
Edit
FLASK_APP=app.py
FLASK_ENV=development
SECRET_KEY=your_jwt_secret
JWT_SECRET_KEY=your_jwt_secret
MAIL_SERVER=smtp.gmail.com
MAIL_PORT=587
MAIL_USERNAME=youremail@gmail.com
MAIL_PASSWORD=yourapppassword
MAIL_USE_TLS=True
FRONTEND_URL=http://localhost:5173
Run backend:

bash
Copy
Edit
flask run
🌐 Frontend Setup (/client)
bash
Copy
Edit
cd client
npm install
Create .env in client/:

env
Copy
Edit
VITE_API_URL=http://127.0.0.1:5000
VITE_GOOGLE_CLIENT_ID=your_google_client_id
Run frontend:

bash
Copy
Edit
npm run dev

🤝 Acknowledgments
Flask-JWT-Extended

React + Vite

Google OAuth Docs

Flask-Mail

📬 Contact
Made with 💻 by [Ankit  Prajapati]
📧 ankitprajapatiofficial876@gmail.com
🔗https://github.com/Ankitprajapati790/fullstack-todo-app
