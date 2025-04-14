# Civitas: Revolutionizing NGO Volunteer Teaching 🌟

**Live Demo:** [https://civitas-dd1d6.web.app/](https://civitas-dd1d6.web.app/)

Civitas is an innovative platform designed to transform how NGOs connect with volunteers and government schools. By creating a seamless digital ecosystem, we're empowering educational initiatives across communities and making quality education accessible to all.

## 💡 The Problem We're Solving

In many communities, NGOs struggle to efficiently coordinate volunteer teachers with schools in need. The manual coordination process is time-consuming, error-prone, and lacks proper tracking mechanisms. Students in underprivileged schools miss out on quality education due to these coordination challenges.

## 🎯 Our Solution

Civitas serves as a centralized platform that bridges the critical gap between NGOs, volunteers, and government schools. We've created a comprehensive ecosystem that handles everything from volunteer onboarding to impact measurement.

## 🚀 Key Features

- **NGO Management**

  - Streamlined NGO registration and profile management
  - Efficient school and volunteer coordination dashboard
  - Real-time program tracking and impact assessment tools

- **Volunteer Engagement**

  - Frictionless volunteer registration and subject selection
  - AI-powered school assignment based on availability and expertise
  - Intuitive teaching schedule management

- **Student Learning**

  - Interactive classroom-style LMS environment
  - Intelligent assignment submission and auto-grading system
  - Comprehensive progress tracking and performance analytics

- **Administrative Tools**
  - Data-rich dashboard analytics for NGOs, volunteers, and schools
  - Smart resource allocation and scheduling algorithms
  - Detailed impact measurement and reporting capabilities

## 🛠️ Technology Stack

- **Frontend**: React 19, React Router, TailwindCSS
- **Backend**: Firebase (Authentication, Firestore, Storage)
- **Build Tools**: Vite
- **Styling**: TailwindCSS, React Icons
- **State Management**: React Hooks
- **Additional Libraries**: React Big Calendar, React DatePicker, Moment.js

## 📈 Impact & Scalability

Civitas is designed to:

- Increase volunteer teaching efficiency by 70%
- Reduce administrative overhead for NGOs by 60%
- Improve student learning outcomes through consistent quality teaching
- Scale seamlessly across different regions and educational contexts

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

This application is deployed at [https://civitas-dd1d6.web.app/](https://civitas-dd1d6.web.app/)

To deploy your own instance:

1. Build the production version

   ```bash
   npm run build
   ```

2. Deploy to Firebase
   ```bash
   firebase deploy
   ```

## 🔮 Future Roadmap

- Mobile application for volunteers and students
- Advanced analytics and reporting capabilities
- Integration with other educational platforms
- Offline mode for areas with limited connectivity
- Translation support for multiple languages

## 👨‍👩‍👧‍👦 Our Team

Our diverse team brings together expertise in education, software development, and social impact. We're passionate about leveraging technology to solve real-world problems in education.

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 👏 Acknowledgements

- [React](https://reactjs.org/)
- [Firebase](https://firebase.google.com/)
- [Vite](https://vitejs.dev/)
- [TailwindCSS](https://tailwindcss.com/)
