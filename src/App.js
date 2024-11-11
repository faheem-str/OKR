import LoginPage from './component/LoginPage/LoginPage'
import './App.css';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import OKRHeader from './component/OkrHeader/OkrHeader';

function App() {
  return (
    <div className="App">
       <Router>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/dashboard" element={<OKRHeader />} />
        <Route path="*" element={<Navigate to="/login" />} />
        
      </Routes>
    </Router>
    </div>
  )
}

export default App;
