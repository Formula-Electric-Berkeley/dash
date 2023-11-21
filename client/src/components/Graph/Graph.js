import React, { useState } from 'react';
import ScatterPlot from './ScatterPlot';

const Graph = () => {
    const [inputs, setInputs] = useState({});

    const handleChange = (event) => {
        const name = event.target.name;
        const value = event.target.value;
        setInputs(values => ({ ...values, [name]: value }))
    }

    const handleConfigureGraph = (event) => {
        event.preventDefault();
        console.log(inputs);
    }

    return (
        <div className='w-full h-full flex justify-center align-middle'>
            <div className='max-w-lg w-4/5 h-4/6 max-h-96 m-auto bg-zinc-800 rounded-3xl'>
                <h1>Configure Visualization</h1>
                <form onSubmit={handleConfigureGraph}>
                    <select name='graphType' onChange={handleChange}>
                        <option value="scatter">Scatter Plot</option>
                        <option value="line">Line Graph</option>
                    </select>
                    <select name='xAxis' onChange={handleChange}>
                        <option value="scatter">Scatter Plot</option>
                        <option value="line">Line Graph</option>
                    </select>
                    <select name='yAxis' onChange={handleChange}>
                        <option value="scatter">Scatter Plot</option>
                        <option value="line">Line Graph</option>
                    </select>
                    <input type="submit" />
                </form>
            </div>
        </div>
    );
};

export default Graph;
