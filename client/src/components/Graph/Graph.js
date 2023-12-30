import React, { useState } from 'react';
import './Graph.css';
import Loading from '../Utils/Loading';
import TraceForm from './TraceForm';

const Graph = () => {
    const [traceForms, setTraceForms] = useState([<TraceForm />])
    const [traceChildDataArray, setTraceChildDataArray] = useState([{}]);

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
        console.log(traceChildDataArray)
    }

    const handleTraceChildDataChange = (index, data) => {
        const newArray = [...traceChildDataArray];
        newArray[index] = data;
        setTraceChildDataArray(newArray);
    }

    return (
        <div className='w-full h-full'>
            <div className='w-full h-full flex justify-center align-middle'>
                <div className='max-w-lg w-4/5 m-auto p-10 
                bg-zinc-800 rounded-3xl'>
                    <h1 className='text-2xl'>Configure Graph</h1>
                    <div className='my-5 overflow-y-scroll min-h-96 max-h-96'>
                        {traceForms.map((data, index) =>
                            <TraceForm
                                index={index}
                                data={data}
                                onDataChange={handleTraceChildDataChange}
                            />)}
                        <button onClick={handleAddTraceForm}>Add Trace</button>
                    </div>
                    <button onClick={handleGraphGenerate}>Generate Graph</button>
                </div>
            </div>

        </div>
    );
};

export default Graph;
