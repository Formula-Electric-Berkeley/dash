import React, { useState, useEffect, useContext } from 'react';
import { DataIdContext } from '../../App';
import './Graph.css';
import Multiselect from 'multiselect-react-dropdown';
import ScatterPlot from './ScatterPlot';

const Graph = () => {
    const { dataId, setDataId } = useContext(DataIdContext);

    const [xAxisElements, setXAxisElements] = useState([]);
    const [yAxisOptions, setYAxisOptions] = useState([]);
    const [inputs, setInputs] = useState({});

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showGraph, setShowGraph] = useState(false);

    useEffect(() => {
        fetch("http://localhost:8000/get_file_data_columns?id=" + dataId, {
            method: "GET",
        })
            .then((response) => response.json())
            .then((data) => {
                let currXElements = []
                let currYElements = []
                for (const entry of data) {
                    let columnName = entry[0].substring(3);
                    currXElements.push(<option value={columnName}>{columnName}</option>)
                    currYElements.push({ name: columnName })
                }
                setXAxisElements(currXElements)
                setYAxisOptions(currYElements)
                setLoading(false);
            })
            .catch((error) => {
                setError(error);
                setLoading(false);
                console.log(error)
            });

    }, [dataId]);

    const handleChange = (event) => {
        const name = event.target.name;
        const value = event.target.value;
        setInputs(values => ({ ...values, [name]: value }))
    }

    const handleConfigureGraph = (event) => {
        event.preventDefault();
        console.log("SUBMIT")
        setShowGraph(true);
    }

    const onSelect = (selectedList, selectedItem) => {
        const name = "yAxis"
        setInputs(values => ({ ...values, [name]: selectedList }))
    }

    const onRemove = (selectedList, removedItem) => {
        const name = "yAxis"
        setInputs(values => ({ ...values, [name]: selectedList }))
    }

    if (loading) {
        return <p>Loading...</p>;
    }

    if (error) {
        return <p>Error: {error.message}</p>;
    }

    return (
        <div className='w-full h-full'>
            {!showGraph && (
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
                                    {xAxisElements}
                                </select>
                                <Multiselect
                                    options={yAxisOptions}
                                    className='mb-5 rounded-lg outline-none'
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
            )}
            {showGraph &&
                <ScatterPlot xColumnName={inputs.xAxis} yColumnArray={inputs.yAxis} />
            }
        </div>
    );
};

export default Graph;
