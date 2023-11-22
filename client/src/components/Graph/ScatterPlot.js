import React, { useEffect, useContext, useState } from 'react';
import Plot from 'react-plotly.js';
import { DataIdContext } from '../../App';

const ScatterPlot = (props) => {
    const { dataId, setDataId } = useContext(DataIdContext);
    const [xValues, setXValues] = useState([]);
    const [yValues, setYValues] = useState([]);

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetch("http://localhost:8000/get_column_data?column=col" + props.xColumnName + "&id=" + dataId, {
            method: "GET",
        })
            .then((response) => response.json())
            .then((data) => {
                let currArray = []
                for (const entry of data) {
                    currArray.push(entry[0])
                }
                setXValues(currArray)
            })
            .catch((error) => {
                console.log(error)
            });

        fetch("http://localhost:8000/get_column_data?column=colgyroxs&id=" + dataId, {
            method: "GET",
        })
            .then((response) => response.json())
            .then((data) => {
                let currArray = []
                for (const entry of data) {
                    currArray.push(entry[0])
                }
                setYValues(currArray)
                setLoading(false);
            })
            .catch((error) => {
                setError(error);
                setLoading(false);
                console.log(error)
            });
    }, [dataId]);

    let data = [
        {
            x: xValues,
            y: yValues,
            type: 'scatter',
            mode: 'markers',
        },
    ]

    let layout = {
        autosize: true,
        font: {
            family: 'Inter, sans-serif',
            size: 16,
            color: '#fff'
        },
        paper_bgcolor: "#000000",
        plot_bgcolor: "#000000",
        title: {
            text: 'TITLE',
        },
        yaxis: {
            title: {
                text: 'VALUES',
            },
            zerolinecolor: "#fff",
            gridcolor: "gray",
            griddash: 'dot',
        },
        xaxis: {
            title: {
                text: props.xColumnName,
            },
            zeroline: false,
        },
        legend: {
            x: 1,
            xanchor: 'right',
            y: 1
        }
    }

    let config = {
    }

    if (loading) {
        return <p>Loading...</p>;
    }

    if (error) {
        return <p>Error: {error.message}</p>;
    }

    return (
        <div className='w-full h-full p-5'>
            <Plot className='w-full h-full' data={data} layout={layout} config={config} />
        </div>
    );
};

export default ScatterPlot;
