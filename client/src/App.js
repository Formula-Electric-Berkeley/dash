import './index.css'
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Layout from './components/Layout/Layout.js'

function App() {
    return (
        <div>
            <Router>
                <Routes>
                    <Route path="/" exact element={<Layout />} />
                </Routes>
            </Router>
        </div>
    );
}

export default App;
