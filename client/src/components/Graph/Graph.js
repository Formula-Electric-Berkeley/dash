import React, { useState, useEffect, useContext } from 'react';
import { DataIdContext } from '../../App';
import './Graph.css';
import Loading from '../Utils/Loading';
import ScatterPlot from './ScatterPlot';
import Select from 'react-select';

const Graph = () => {
    const { dataId, setDataId } = useContext(DataIdContext);

    const [axisElements, setAxisElements] = useState([]);

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showGraph, setShowGraph] = useState(false);

    useEffect(() => {
        fetch("http://localhost:8000/get_file_data_columns?id=" + dataId, {
            method: "GET",
        })
            .then((response) => response.json())
            .then((data) => {
                let currElements = []
                for (const entry of data) {
                    let columnName = entry.substring(3);
                    currElements.push({ value: columnName, label: columnName })
                }
                setAxisElements(currElements)
                setLoading(false);
            })
            .catch((error) => {
                setError(error);
                setLoading(false);
                console.log(error)
            });

    }, [dataId]);

    if (loading) {
        return <Loading />;
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

                        <Select
                            className='my-5'
                            styles={{
                                option: (baseStyles, state) => ({
                                    ...baseStyles,
                                    color: 'black',
                                    backgroundColor: state.isFocused || state.isSelected ? '#fbb414' : null,
                                }),
                            }}
                            options={[{ value: 'scatter', label: 'Scatter Plot' },
                            { value: 'line', label: 'Line Chart' }]}
                            placeholder={<div>Graph Type</div>}
                        />

                        <Select
                            className='my-5'
                            styles={{
                                option: (baseStyles, state) => ({
                                    ...baseStyles,
                                    color: 'black',
                                    backgroundColor: state.isFocused || state.isSelected ? '#fbb414' : null,
                                }),
                            }}
                            options={axisElements}
                            placeholder={<div>X-Axis</div>}
                        />

                        <Select
                            className='my-5'
                            styles={{
                                option: (baseStyles, state) => ({
                                    ...baseStyles,
                                    color: 'black',
                                    backgroundColor: state.isFocused || state.isSelected ? '#fbb414' : null,
                                }),
                            }}
                            options={axisElements}
                            placeholder={<div>Y-Axis</div>}
                        />
                    </div>
                </div>
            )}
            {//showGraph &&
                //  <ScatterPlot xColumnName={inputs.xAxis} yColumnArray={inputs.yAxis} />
            }
        </div>
    );
};

export default Graph;
