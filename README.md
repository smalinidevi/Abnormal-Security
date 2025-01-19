# Abnormal-Security

<h2>Frontend Structure</h2>

<h3>1. Components</h3>

<h4>Login.js:</h4>Handles user login with email and password validation.

<h4>Register.js:</h4> Manages user registration with password validation, role selection, and redirects to MFA setup.

<h4>AuthLogin.js:</h4> Validates OTP for login after MFA.

<h4>AuthRegister.js:</h4> Fetches and displays a QR code for MFA setup and validates OTP for registration completion.

<h4>RoleBased.js:</h4> Displays role-based content (e.g., manager or guest features) after login.

<h4>FileUpload.js:</h4> Allows encrypted file uploads using AES-256 encryption.

<h3>2. Utilities</h3>

<h4>utils.js:</h4> Contains helper functions for validating email and password formats.

<h4>api.js:</h4> Configures Axios for backend API calls.

<h3>3. Redux Store</h3> Centralized state management for user authentication, roles, and file upload status.

<h3>4. Router (App.js)</h3>

<h4>Configures routes for various components:</h4>  

<h4>/: Registration</h4>

<h4>/login: Login</h4>

<h4>/auth-login: MFA Login</h4>

<h4>/auth-register: MFA Registration</h4>

<h4>/rolebased: Role-based actions</h4>

<h4>/fileupload: File upload feature</h4>

<h2>Backend Structure</h2>  
<h3>1. Models</h3>
<h4>User:</h4> Stores user details (email, name, password, role, MFA secret).
<h4>EncryptedFile:</h4> Stores metadata for uploaded files.
<h3>2. Serializers</h3>
<h4>RegisterSerializer:</h4> Validates and processes registration data.
<h4>LoginSerializer:</h4> Validates login credentials.
<h3>3. Views</h3>
<h4>RegisterView:</h4> Handles user registration and generates QR codes for MFA.
<h4>GetQRView:</h4> Returns the QR code for a user's MFA setup.
<h4>ValidateOTPView:</h4> Validates OTP for login and registration.
<h4>LoginView:</h4> Authenticates users and issues JWT tokens.
<h4>GetRoleView:</h4> Returns the user's role based on their email.
<h4>UploadFileView:</h4> Handles AES-encrypted file uploads.
<h4>GetFilesView:</h4> Retrieves uploaded file metadata.

<h3>4. Utility Functions</h3>  
<h4>generate_qr_code:</h4> Creates a QR code for MFA.
<h4>encrypt_file:</h4> Implements AES-256 encryption for file uploads.
<h3>5. URL Configuration</h3>
<h4>Routes for the above views, including JWT token management:</h4>  

<h4>/register/</h4>  
<h4>/login/</h4>
<h4>/get-qr/<email>/</h4>
<h4>/validate-otp/<email>/</h4>
<h4>/role/<email>/</h4>
<h4>/upload-file/</h4>

  
<h2>Security Features</h2>
<h3>MFA (TOTP):</h3>
<h4>QR code generation using pyotp and qrcode.</h4>
<h4>OTP validation for login and registration.</h4>

<h3>AES-256 Encryption:</h3>

<h4>Ensures file confidentiality during uploads.</h4>

<h3>JWT Authentication:</h3>

<h4>Secures API endpoints with access and refresh tokens.</h4>

<h3>Validation:</h3>

<h4>Input validation for emails, passwords, and OTPs.</h4>
