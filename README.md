# Server.js Documentation

## Overview
This is the server.js file for a web application built using Node.js and Express. The application includes features such as user authentication, file uploads, integration with external APIs, and more.

## Technologies Used
- Node.js
- Express
- MongoDB (for database)
- Axios (for making HTTP requests)
- Multer (for file uploads)
- EJS (as the view engine)
- Bcrypt (for password hashing)
- Express-session (for session management)
- Nodemailer (for sending emails)

## Getting Started
1. Install Node.js and MongoDB on your machine.
2. Clone this repository.
3. Install dependencies using `npm install`.
4. Set up a MongoDB database and update the connection string in the code.
5. Create a `.env` file with the required environment variables (see `.env.example`).
6. Run the server using `npm start` or `node server.js`.

## Project Structure
- `server.js`: Main entry point for the application.
- `public/`: Static files (CSS, JavaScript, etc.).
- `views/`: EJS templates for rendering pages.
- `uploads/`: uploaded images from protfolio.
- `.env`: Contain passwords and login.
- `paskage-lock.json`: contain dependencies.


## Features
1. **User Authentication:**
   - Register and login functionality with password hashing.
   - Middleware to check user authentication and administrator roles.

2. **File Uploads:**
   - Multer used for handling file uploads.
   - Images are stored in memory as base64 strings.

3. **External API Integration:**
   - Fetching data from NASA API and Numbers API.

4. **Email Notifications:**
   - Nodemailer used for sending welcome emails and admin notifications.

5. **Database:**
   - MongoDB used as the database.
   - Schemas and models defined for User and PortfolioItem.

6. **Admin Page:**
   - Accessible only to administrators, displays portfolio items and sends admin notifications.

## Routes
- `/page1`: Renders page1.
- `/page2`: Fetches random trivia from Numbers API and renders page2.
- `/page3`: Fetches NASA APOD data and renders page3.
- `/page4`: Fetches order book data and renders page4.
- `/page5`: Renders page5.
- `/login`: Renders login page and handles login requests.
- `/register`: Renders registration page and handles registration requests.
- `/admin`: Renders admin page (accessible to administrators only).
- `/addPortfolioItem`: Handles adding portfolio items (accessible to administrators only).
- `/editPortfolioItem/:id`: Handles editing portfolio items (accessible to administrators only).
- `/deletePortfolioItem/:id`: Handles deleting portfolio items (accessible to administrators only).

## Dependencies
- [Express](https://expressjs.com/)
- [Axios](https://axios-http.com/)
- [Multer](https://www.npmjs.com/package/multer)
- [Mongoose](https://mongoosejs.com/)
- [Bcrypt](https://www.npmjs.com/package/bcrypt)
- [Express-session](https://www.npmjs.com/package/express-session)
- [Nodemailer](https://nodemailer.com/)

## Configuration
Ensure you set up the required environment variables in the `.env` file as per the provided `.env.example`.

## License
This project is licensed under the [MIT License](LICENSE).
