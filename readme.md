# 🌐 Network – Minimalist Social Network

> Final project for **CS50’s Web Programming with Python and JavaScript** – *Portfolio Project*

---

## 📋 Description

**Network** is a microblogging social platform where users can:

- Post short messages
- Like other users' posts
- Follow and unfollow other users
- View a personalized feed with posts from people they follow
- Edit their own posts
- View user profiles with follower/following statistics

The project is built as a **Single Page Application (SPA)** with a Django backend and vanilla JavaScript frontend, using a RESTful API for all interactions.

---

## 🚀 Technologies used

- **Backend**: Django 6.0, Python 3.12
- **Frontend**: HTML5, CSS3, JavaScript (ES6), Bootstrap 5, Bootstrap Icons
- **Database**: SQLite (development), PostgreSQL (recommended for production)
- **Authentication**: Django's native user system with session management
- **REST API**: Custom JSON endpoints without DRF (pure Django)

---

## 🎯 Key features

| Feature | Description |
|---------|-------------|
| 🔐 **Authentication** | Registration, login, logout with unique user validation |
| ✍️ **Create posts** | Form to publish text messages |
| 📄 **Global feed** | All posts ordered by date descending with pagination |
| 👤 **User profile** | Shows username, follower/following counts, and user's posts |
| ➕ **Follow/Unfollow** | Dynamic action from any user's profile (real‑time updates) |
| ❤️ **Likes** | Like/unlike posts (optimistic update + server sync) |
| ✏️ **Edit posts** | Only the author can edit their posts (DOM replacement) |
| 📰 **Personalized feed** | Shows only posts from followed users |
| 📌 **Pagination** | Previous/Next navigation with page persistence per section |

---

## 🧠 Technical decisions (for recruiters)

- **SPA Architecture**: All interactions are handled via `fetch()` and DOM updates, without page reloads, providing a smooth, native‑like user experience.
- **RESTful API**: Endpoints return JSON, decoupling frontend from backend and facilitating future extensions (e.g., mobile app).
- **Optimistic updates**: Likes and follows are reflected immediately in the UI while the request is sent in the background. On error, changes are reverted, ensuring consistency without sacrificing speed.
- **Server‑side pagination**: Uses Django's `Paginator` to limit posts per page, optimising performance and reducing network load.
- **Security**: All data‑modifying operations are protected with `@login_required`. Ownership validation is performed on the server, preventing users from editing or deleting others' content even if they try to manipulate the frontend.
- **Unauthenticated user handling**: The frontend hides interactive buttons (like, follow, edit) when the user is not logged in, and the backend rejects any unauthorised requests.
- **Clean and maintainable code**: Clear separation of concerns: models, views (API), templates, and frontend logic organised into a single `network.js` file.

---

## 📁 Project structure (relevant)
network/
├── models.py # User (with following), Post, Like
├── views.py # API endpoints (all_post, profile, following, etc.)
├── urls.py # REST routes and page routes
├── templates/network/ # layout.html, index.html, login.html, register.html
├── static/network/ # network.js, styles.css
└── requirements.txt # Dependencies

## 🚧 Future improvements (roadmap)
    □  Comments on posts
    □  Real‑time notifications (WebSockets)
    □  Image uploads in posts
    □  User search
    □  Dark mode
    □  Automated tests with Django Test

##  ⚠️ Disclaimer for CS50 students

    This project was developed as part of CS50’s Web Programming with Python and JavaScript.
    If you are currently taking the course, please do not copy this code for your own solution. 
    The goal of the course is for you to learn the concepts and develop your own programming skills. 
    Using this repository as a reference is fine, but submitting a literal copy would violate CS50's academic policy and would not benefit your learning.
    I encourage you to use this project for inspiration, to understand one possible structure, and then build your own version from scratch. The real value lies in the process!
