# 🔒 Secure File Sharing

![Secure File Sharing](https://img.shields.io/badge/Security-High-brightgreen)
![React](https://img.shields.io/badge/Frontend-React-blue)
![Django](https://img.shields.io/badge/Backend-Django-green)
![License](https://img.shields.io/badge/License-MIT-orange)  

A secure file-sharing application using **React, Redux, Django, and Google Authenticator** for 2FA authentication. This project ensures that file transfers are safe, authenticated, and easy to use.  

## 🚀 Features  

✅ **User Authentication** – Secure login/registration using OTP-based **Google Authenticator**.  
✅ **Two-Factor Authentication (2FA)** – Extra layer of security with **QR-based OTP**.  
✅ **File Upload & Download** – Securely share files via a backend-powered system.  
✅ **Validation Mechanisms** – Email, password, and username validation for user security.  
✅ **Anti-Back Navigation** – Prevents users from navigating back to unauthorized pages.  
✅ **SSL/TLS Security** – Ensures the back-end server only accepts HTTPS traffic with valid certificates.  
✅ **Clean UI** – Responsive and user-friendly interface with error handling.  

---

## 🛠️ Tech Stack  

**Frontend:**  
⚡ React.js, Redux  
🎨 CSS, Bootstrap  

**Backend:**  
🛡️ Django REST Framework (DRF)  
🟢 SQLite  
🔑 Google Authenticator (OTP-based authentication)  

---

## 📺 Demo Video
[![Watch the Video](https://img.youtube.com/vi/YOUR_VIDEO_ID/0.jpg)](https://www.youtube.com/watch?v=YOUR_VIDEO_ID)

---

## 🚀 Installation & Setup  

### 🔹 **Clone the Repository**  
```bash
git clone https://github.com/smalinidevi/Secure-File-Sharing.git
cd Secure-File-Sharing
```

### 🔹 **Backend Setup (Django)**  
```bash
cd backend
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
python manage.py migrate
python manage.py runserver
```

### 🔹 **Frontend Setup (React)**  
```bash
cd frontend
npm install
npm start
```

---

## 📌 API Endpoints  

| Method | Endpoint                      | Description             |
|--------|--------------------------------|-------------------------|
| POST   | `/register/`                   | Register a new user     |
| POST   | `/login/`                      | Login user             |
| GET    | `/get-qr/:email/`              | Fetch QR Code          |
| POST   | `/validate-otp/:email/`        | Validate OTP           |
| POST   | `/upload-file/`                | Upload file            |
| GET    | `/download-file/:file_id/`     | Download file          |

---

## 🎯 Future Enhancements  

✅ **End-to-End Encryption** – AES-based encryption for file security.  
✅ **Role-Based Access** – Define user roles for better control.  
✅ **Drag & Drop File Upload** – Improve user experience.  
✅ **Multi-Factor Authentication (MFA)** – Further enhance security.  

---

## 🤝 Contributing  

1. **Fork the repository**  
2. **Create a new branch**: `git checkout -b feature-branch`  
3. **Commit your changes**: `git commit -m "Add new feature"`  
4. **Push to the branch**: `git push origin feature-branch`  
5. **Create a Pull Request**  

---

## 📄 License  

This project is licensed under the **MIT License**.  

📧 **Contact:** [LinkedIn](https://www.linkedin.com/in/malinidevi-s-/)  

---

**🔒 Secure File Sharing – Because Security Matters!** 🚀

