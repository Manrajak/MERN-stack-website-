# Machine Test for MERN Stack Developer

## Objective

Build a MERN stack with:
- Admin login (JWT)
- Agent creation & management
- CSV/XLSX/XLS upload and distribution

## Setup Instructions

1. **Clone the repository**
2. **Install dependencies**
   - `cd server && npm install`
   - `cd client && npm install`
3. **Configure environment variables**
   - Create `server/.env` with:
     ```
     mongoDb=your_mongodb_connection_string
     JWT_SECRET=your_jwt_secret
     ```
4. **Start the backend**
   - `cd server && npm start`
5. **Start the frontend**
   - `cd client && npm run dev`
6. **Access the app**
   - Login: `/login`
   - Register: `/register`
   - Add Agent: `/add-agent`
   - Upload List: `/upload-list`

## Features

- **User Login:** JWT authentication, error handling, redirects.
- **Agent Management:** Add, list, delete agents. Country code validation.
- **List Upload:** Accepts CSV/XLSX/XLS, validates format, distributes items, displays per agent.
- **Validation & Error Handling:** All forms and backend routes.
- **Responsive UI:** Bootstrap and custom CSS.

## Demo

[Google Drive Demo Link](your-demo-link-here)

## Notes

- Ensure MongoDB is running and accessible.
- Use correct file format for uploads (`FirstName,Phone,Notes`).
- All passwords are securely hashed.

---

**Your backend and documentation are now fully polished and ready for professional review.  
Let me know if you want similar polish for frontend files or further enhancements!**