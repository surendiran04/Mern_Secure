# Mern Secure

Mern Secure is a secure web application built using the MERN stack (MongoDB, Express, React, Node.js). It features authentication and authorization using JWT tokens, Google OAuth integration, dynamic routing, and various other technologies for a seamless user experience.

 <a href="https://drive.google.com/file/d/115HjnJDKEiHBCNv8cDJWKpLaNV-NaF8r/view?usp=drive_link">Demo Video</a>

## Features

### Frontend
- **Pages**:
  - **Login Page** <br>
   ![Login Page](./images/Login.png)
  - **Signup Page**
    ![SignUp Page](./images/SignUp.png)
  - **Forgot Password Page**
    ![ForgotPassword Page](./images/ForgotPassword.png)
  - **Reset Password Page**
    ![ResetPassword Page](./images/ResetPassword.png)
  - **Dashboard Page**
    ![Dashboard Page](./images/Dashboard.png)
  - **Reset Password Work Flow**
       ![Reset Password work flow img](./images/DB_PASS_Reset.png)
   - **Google OAuth Work Flow**
       ![Google Oauth work flow img](./images/Google_OAuth.png)
- **Authentication & Authorization**: JWT tokens are used to ensure secure access.
- **Dynamic Routing**: Routes are dynamically managed to ensure smooth navigation.
- **Notifications**: Success and error messages are displayed using React-Toastify.
- **Styling**: TailwindCSS is used for consistent and responsive styling.
- **State Management**: Context API is used for managing the application state.
- **Form Handling**: React-Hook-Form is utilized for easy form manipulation and error handling.
- **Data Fetching**: Fetch API with try & catch blocks are used for synchronous data fetching from backend APIs.

### Backend
- **Database**: MongoDB is used for storing user and application data.
- **Email Service**: Nodemailer is used for sending emails for password resets and other notifications.
- **Authentication & Authorization**: JWT is used for securing endpoints and managing user sessions.
- **Password Security**: Bcrypt is used for hashing passwords to enhance security.
- **Controllers**: Dynamic controllers handle various data operations.
- **Routing**: Express Router is used for managing API routes.
- **Google OAuth**: Passport.js is used for Google login and signup integration.

## Technologies Used
- **Frontend**: React, TailwindCSS, React-Toastify, React-Hook-Form, Context API
- **Backend**: Node.js, Express.js, MongoDB, Mongoose, Passport.js, Nodemailer, JWT, Bcrypt


### Steps
1. **Clone the repository**:
   ```bash
   git clone https://github.com/surendiran04/mern-secure.git
   cd mern-secure

 




