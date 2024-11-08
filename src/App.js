import LoginPage from './component/LoginPage/LoginPage'
import './App.css';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';

function App() {
  return (
    <div className="App">
       <Router>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        {/* <Route path="/home" element={<HomePage />} /> */}
        {/* Redirect to login if no route matches */}
        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
    </Router>
    </div>
  );
}

export default App;
