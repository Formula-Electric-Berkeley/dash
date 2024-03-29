import React, { useState } from 'react';
import './Graph.css';
import Loading from '../Utils/Loading';
import TraceForm from './TraceForm';
import GenerateGraph from './GenerateGraph';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faChartLine, faCirclePlus, faArrowRight } from '@fortawesome/free-solid-svg-icons'

const Graph = () => {
    const [traceForms, setTraceForms] = useState([<TraceForm />])
    const [traceChildDataArray, setTraceChildDataArray] = useState([{}]);

    const [showGraph, setShowGraph] = useState(false);

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    if (loading) {
        return <Loading />;
    }

    if (error) {
        return <p>Error: {error.message}</p>;
    }

    const handleAddTraceForm = () => {
        const newTrace = Date.now()
        setTraceForms(v => [...v, newTrace])
        setTraceChildDataArray([...traceChildDataArray, '']);
    }

    const handleGraphGenerate = () => {
        setShowGraph(true);
    }

    const handleTraceChildDataChange = (index, data) => {
        const newArray = [...traceChildDataArray];
        newArray[index] = data;
        setTraceChildDataArray(newArray);
    }

    return (
        <div className='w-full h-full'>
            {!showGraph && (
                <div className='w-full h-full flex justify-center align-middle'>
                    <div className='max-w-2xl w-4/5 m-auto p-10 
                rounded-3xl'>
                        <h1 className='text-2xl'>Configure Graph
                            <FontAwesomeIcon className='icon ml-3' icon={faChartLine} /></h1>
                        <div className='my-5 h-full'>
                            {traceForms.map((data, index) =>
                                <TraceForm
                                    index={index}
                                    data={data}
                                    onDataChange={handleTraceChildDataChange}
                                />)}
                            <button className='secondary-btn' onClick={handleAddTraceForm}>
                                Add Trace
                                <FontAwesomeIcon className='ml-2' icon={faCirclePlus} />
                            </button>
                        </div>
                        <button className='submit-btn' onClick={handleGraphGenerate}>
                            Generate Graph
                            <FontAwesomeIcon className='ml-2' icon={faArrowRight} />
                        </button>
                    </div>
                </div>
            )}
            {showGraph &&
                <GenerateGraph data={traceChildDataArray} />
            }
        </div>
    );
};

export default Graph;
