import './index.css'
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Landing from './components/Landing/Landing.js'
import React, { useState, createContext } from 'react';

//export const DataIdContext = createContext("dashdataed579ee6");
export const DataIdContext = createContext();

function App() {
    const [dataId, setDataId] = useState("dashdataed579ee6");

    return (
        <div>
            <DataIdContext.Provider value={{ dataId, setDataId }}>
                <Router>
                    <Routes>
                        <Route path="/" exact element={<Landing />} />
                    </Routes>
                </Router>
            </DataIdContext.Provider>
        </div>
    );
}

export default App;
