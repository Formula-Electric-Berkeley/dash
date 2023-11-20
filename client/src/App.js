import './index.css'
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Landing from './components/Landing/Landing.js'
import React, { createContext } from 'react';

export const DataIdContext = createContext("dashdataed579ee6");

function App() {

    return (
        <div>
            <Router>
                <Routes>
                    <Route path="/" exact element={<Landing />} />
                </Routes>
            </Router>
        </div>
    );
}

export default App;
