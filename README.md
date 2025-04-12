# Civitas: NGO Volunteer Teaching Platform

Civitas is a web-based platform designed to bridge the gap between NGOs, volunteers, and government schools. The platform facilitates volunteer teaching engagements, school management, and provides a comprehensive Learning Management System (LMS) for students.

## 🚀 Features

- **NGO Management**

  - NGO registration and profile management
  - School and volunteer coordination
  - Program tracking and impact assessment

- **Volunteer Engagement**

  - Volunteer registration and subject selection
  - School assignment based on availability and expertise
  - Teaching schedule management

- **Student Learning**

  - Classroom-style LMS environment
  - Assignment submission and auto-grading
  - Progress tracking and performance analytics

- **Administrative Tools**
  - Dashboard analytics for NGOs, volunteers, and schools
  - Resource allocation and scheduling
  - Impact measurement and reporting

## 🛠️ Technology Stack

- **Frontend**: React 19, React Router, TailwindCSS
- **Backend**: Firebase (Authentication, Firestore, Storage)
- **Build Tools**: Vite
- **Styling**: TailwindCSS, React Icons
- **State Management**: React Hooks
- **Additional Libraries**: React Big Calendar, React DatePicker, Moment.js

## 📋 Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- Firebase account

## 🔧 Installation

1. Clone the repository

   ```bash
   git clone https://github.com/yourusername/civitas.git
   cd civitas
   ```

2. Install dependencies

   ```bash
   npm install
   ```

3. Configure Firebase

   - Create a Firebase project at [Firebase Console](https://console.firebase.google.com/)
   - Update the Firebase configuration in `src/firebase.js`
   - Enable Authentication, Firestore, and Storage services

4. Start the development server
   ```bash
   npm run dev
   ```

## 🏗️ Project Structure

```
civitas/
├── public/           # Static assets
├── src/
│   ├── assets/       # Images and other assets
│   ├── components/   # Reusable React components
│   │   ├── NGODashboard/     # NGO-specific components
│   │   ├── StudentDashboard/ # Student-specific components
│   │   ├── VolunteerDashboard/ # Volunteer-specific components
│   │   ├── Landing.jsx       # Landing page component
│   │   ├── Login.jsx         # Authentication component
│   │   ├── Navbar.jsx        # Navigation component
│   │   └── Registration.jsx  # User registration component
│   ├── routes/       # Application routes
│   ├── assignments/  # Assignment-related functionality
│   ├── App.jsx       # Main application component
│   ├── main.jsx      # Entry point
│   └── firebase.js   # Firebase configuration
├── functions/        # Firebase Cloud Functions
└── package.json      # Project dependencies
```

## 👥 User Roles

### NGO Administrators

- Register and manage NGO profiles
- Coordinate with schools and volunteers
- Monitor teaching activities and generate reports

### Volunteers

- Register with personal and professional information
- Select teaching subjects and availability
- Manage teaching schedules and class materials

### Students

- Access classroom resources and assignments
- Submit completed work for grading
- Track learning progress and performance

## 🚀 Deployment

This application is configured to deploy to Firebase Hosting:

1. Build the production version

   ```bash
   npm run build
   ```

2. Deploy to Firebase
   ```bash
   firebase deploy
   ```

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 👏 Acknowledgements

- [React](https://reactjs.org/)
- [Firebase](https://firebase.google.com/)
- [Vite](https://vitejs.dev/)
- [TailwindCSS](https://tailwindcss.com/)
