import './index.css'
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Landing from './components/Landing/Landing.js'
import React, { useState, createContext } from 'react';

export const DataIdContext = createContext();

function App() {
    const [dataId, setDataId] = useState("dashdatacb860344");

    return (
        <div>
            <DataIdContext.Provider value={{ dataId, setDataId }}>
                <Router basename="/dash2">
                    <Routes>
                        <Route path="/" exact element={<Landing />} />
                    </Routes>
                </Router>
            </DataIdContext.Provider>
        </div>
    );
}

export default App;
