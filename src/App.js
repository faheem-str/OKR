import LoginPage from './component/LoginPage/LoginPage'
import './App.css';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import CompanyOkr from './component/CompanyOkr/CompanyOkr';
import OKRHeader from './component/OkrHeader/OkrHeader';

function App() {
  return (
    <div className="App">
      <OKRHeader />
       <Router>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/home" element={<CompanyOkr />} />
        {/* Redirect to login if no route matches */}
        <Route path="*" element={<Navigate to="/home" />} />
      </Routes>
    </Router>
    </div>
  );
}

export default App;
