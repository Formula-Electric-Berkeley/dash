import './index.css'
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Landing from './components/Landing/Landing.js'
import React, { useState } from 'react';

export const CurrentDataContext = React.createContext(null);

function App() {
    const [currentDataId, setCurrentDataId] = useState(null);

    return (
        <div>
            <CurrentDataContext.Provider value={{ currentDataId: currentDataId, setCurrentData: setCurrentDataId }}>

                <Router>
                    <Routes>
                        <Route path="/" exact element={<Landing />} />
                    </Routes>
                </Router>
            </CurrentDataContext.Provider>
        </div>
    );
}

export default App;
