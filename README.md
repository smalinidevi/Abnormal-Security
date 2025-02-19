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
[video](https://drive.google.com/file/d/1zNBF6tqLhiqLdN3bvnV9ZbX4ETUCYLA7/view?usp=sharing)

---

## 🚀 Installation & Setup  

### 🔹 **Clone the Repository**  
```bash
git clone https://github.com/smalinidevi/Secure-File-Sharing.git
cd Secure-File-Sharing
```

### 🔹 **Set Up the Application**  
```bash
docker-compose up --build
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

✅ **End-to-End Encryption** – Implement AES-based encryption for both file storage and transfers.  
✅ **Role-Based Access Control (RBAC)** – Introduce granular permissions for different user roles.  
✅ **Drag & Drop File Upload** – Enhance user experience with an intuitive drag-and-drop feature.  
✅ **Multi-Factor Authentication (MFA)** – Extend authentication security with multiple verification methods.  
✅ **File Activity Logs** – Implement detailed audit logging to track file access and modifications.  
✅ **Advanced Sharing Controls** – Introduce password-protected file links and expiration settings.  
✅ **Cloud Storage Integration** – Provide seamless integration with cloud storage platforms like AWS S3 or Google Drive.  
✅ **Mobile App Support** – Develop a mobile-friendly version for secure file access on the go.  

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

