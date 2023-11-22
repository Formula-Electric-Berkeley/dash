import React, { useState } from 'react';
import './Graph.css';
import Multiselect from 'multiselect-react-dropdown';
import ScatterPlot from './ScatterPlot';

const Graph = () => {
    const [inputs, setInputs] = useState({});
    const [options, setOptions] = useState([{ name: 'Option 1', id: 1 }, { name: 'Option 2', id: 2 }]);

    const handleChange = (event) => {
        const name = event.target.name;
        const value = event.target.value;
        setInputs(values => ({ ...values, [name]: value }))
    }

    const handleConfigureGraph = (event) => {
        event.preventDefault();
        console.log(inputs);
    }

    const onSelect = (selectedList, selectedItem) => {
        const name = "yAxis"
        setInputs(values => ({ ...values, [name]: selectedList }))
    }

    const onRemove = (selectedList, removedItem) => {
        const name = "yAxis"
        setInputs(values => ({ ...values, [name]: selectedList }))
    }

    return (
        <div className='w-full h-full flex justify-center align-middle'>
            <div className='max-w-lg w-4/5 m-auto p-10 
                bg-zinc-800 rounded-3xl'>
                <h1 className='text-2xl'>Configure Graph</h1>
                <form onSubmit={handleConfigureGraph}
                    className='text-black'>
                    <div className='w-full flex flex-col'>
                        <select name='graphType' onChange={handleChange}
                            className='w-full my-5 py-1 px-2 rounded-lg outline-none'>
                            <option value="" disabled selected>Select Graph Type</option>
                            <option value="scatter">Scatter Plot</option>
                            <option value="line">Line Graph</option>
                        </select>
                        <select name='xAxis' onChange={handleChange}
                            className='w-full mb-5 py-1 px-2 rounded-lg outline-none'>
                            <option value="" disabled selected>Select X-Axis</option>
                            <option value="scatter">Scatter Plot</option>
                            <option value="line">Line Graph</option>
                        </select>
                        <Multiselect
                            options={options}
                            className='mb-5 rounded-lg outline-none'
                            //                             selectedValues={this.state.selectedValue} // Preselected value to persist in dropdown
                            onSelect={onSelect}
                            onRemove={onRemove}
                            placeholder='Select Y-Axis'
                            displayValue="name"
                        />
                        <button className='m-auto px-10 py-1 bg-yellow
                                hover-shadow-yellow rounded-full text-black
                                font-bold cursor-pointer'
                            type='submit'>
                            Generate Graph</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Graph;
