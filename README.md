# Posh Pine E-commerce

A modern React-based e-commerce website for premium shirts and casual wear.

## Project Structure

```
poshpine/
├── src/                    # React frontend
│   ├── components/         # React components
│   ├── App.jsx            # Main app component
│   ├── main.jsx           # Entry point
│   └── styles.css         # Global styles
├── backend/               # Express.js backend
│   ├── server.js          # Backend server
│   └── package.json       # Backend dependencies
├── index.html            # HTML template
└── package.json          # Frontend dependencies
```

## Setup Instructions

### Prerequisites
- Node.js (v16 or higher)
- npm

### 1. Install Frontend Dependencies
```bash
cd C:\Users\HP\Downloads
npm install
```

### 2. Install Backend Dependencies
```bash
cd backend
npm install
```

### 3. Start the Backend Server
```bash
cd backend
npm start
# or for development with auto-reload:
npm run dev
```

The backend will run on `http://localhost:5000`

### 4. Start the Frontend Development Server
Open a new terminal/PowerShell and run:
```bash
cd C:\Users\HP\Downloads
npm run dev
```

The frontend will run on `http://localhost:5173`

### 5. View the Application
Open your browser and go to `http://localhost:5173`

## API Endpoints

- `GET /api/products` - Get all products
- `GET /api/products/:id` - Get product by ID
- `GET /api/health` - Health check

## Features

- 🛍️ Product catalog with categories
- 🛒 Shopping cart functionality
- 📱 Responsive design
- 💳 WhatsApp checkout integration
- 🎨 Modern dark theme

## Technologies Used

- **Frontend:** React 18, Vite
- **Backend:** Node.js, Express.js
- **Styling:** CSS Variables, Inter Font# Posh-Pine
