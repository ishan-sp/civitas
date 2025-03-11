import React, { useState } from 'react';
import Landing from './components/Landing';
// import Home from './components/Home'; // Uncomment this when you create the Home component

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  return (
    <div className="min-h-screen">
      {isLoggedIn ? (
        // <Home /> // Uncomment this when you create the Home component
        <div>Home Component Placeholder</div>
      ) : (
        <Landing />
      )}
    </div>
  );
}

export default App;