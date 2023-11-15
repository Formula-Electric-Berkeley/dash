import Landing from './components/landing/landing.js'
import './index.css'
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";


function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" exact element={<Landing />} />
            </Routes>
        </Router>
    );
}

export default App;
