import React, { useState, useEffect, useContext } from 'react';
import { DataIdContext } from '../../App';
import './Graph.css';
import Loading from '../Utils/Loading';
import TraceForm from './TraceForm';

const Graph = () => {
    const { dataId, setDataId } = useContext(DataIdContext);

    const [loading, setLoading] = useState(false); // TODO: set to 'true'
    const [error, setError] = useState(null);

    if (loading) {
        return <Loading />;
    }

    if (error) {
        return <p>Error: {error.message}</p>;
    }

    return (
        <div className='w-full h-full'>
            <div className='w-full h-full flex justify-center align-middle'>
                <div className='max-w-lg w-4/5 m-auto p-10 
                bg-zinc-800 rounded-3xl'>
                    <h1 className='text-2xl'>Configure Graph</h1>
                    <TraceForm />
                </div>
            </div>

        </div>
    );
};

export default Graph;
