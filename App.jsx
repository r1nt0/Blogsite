

import { BrowserRouter as Router, Routes, Route} from 'react-router-dom';

import LoginPage from './components/login';
import SignupPage from './components/signup';
import UserWindow from './components/UserWindow';

function App() {

  return (
    <Router>
    <Routes>
    <Route path="/" element={<LoginPage />} />
    <Route path="/login" element={<LoginPage />} />
      <Route path="/signup" element={<SignupPage />} />
      <Route path="/user" element={<UserWindow />} />
      </Routes>
    </Router>
  );
}

export default App
