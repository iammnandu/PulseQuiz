import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import Signup from './pages/Signupuser';
import Signin from './pages/Signinuser';
import Asignup from './pages/Signupadmin';
import Asignin from './pages/Signinadmin';
import Userlayout from './layouts/Userlayout'; 

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/users/signup" element={<Signup />} />
        <Route path="/users/signin" element={<Signin />} />
        <Route path="/admin/signup" element={<Asignup />} />
        <Route path="/admin/signin" element={<Asignin />} />
        <Route path="/dashboard" element={<Userlayout />} />
          <Route>
            
          </Route>
      </Routes>
    </Router>
  );
}

export default App;