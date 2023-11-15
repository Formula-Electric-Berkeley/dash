import './index.css'
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Landing from './components/landing/landing.js'
import Navbar from './components/navbar/navbar.js'


function App() {
    return (
        <div>
            <Navbar />
            <Router>
                <Routes>
                    <Route path="/" exact element={<Landing />} />
                </Routes>
            </Router>
        </div>
    );
}

export default App;
