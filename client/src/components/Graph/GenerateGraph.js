import React, { useState, useEffect } from 'react';
import './Graph.css';
import Loading from '../Utils/Loading';
import Plot from 'react-plotly.js';

const GenerateGraph = (props) => {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const [revise, setRevise] = useState(0);

    useEffect(() => {
        for (const trace of props.data) {
            trace.type = 'scatter'

            if (trace.graphType === 'scatter') {
                trace.mode = 'markers'
            } else if (trace.graphType === 'line') {
                trace.mode = 'lines'
            }

            fetch("http://localhost:8000/get_column_data?column=col" +
                trace.xAxis + "&id=" + trace.sourceDataId, {
                method: "GET",
            })
                .then((response) => response.json())
                .then((data) => {
                    let currArray = []
                    for (const entry of data) {
                        currArray.push(entry[0])
                    }
                    trace.x = currArray
                    setRevise((revise) => revise + 1)
                })
                .catch((error) => {
                    console.log(error)
                });

            fetch("http://localhost:8000/get_column_data?column=col" +
                trace.yAxis + "&id=" + trace.sourceDataId, {
                method: "GET",
            })
                .then((response) => response.json())
                .then((data) => {
                    let currArray = []
                    for (const entry of data) {
                        currArray.push(entry[0])
                    }
                    trace.y = currArray
                    setRevise((revise) => revise + 1)
                })
                .catch((error) => {
                    console.log(error)
                });
        }
    }, [props.data]);

    if (revise / 2 <= props.data.length) {
        return <Loading />;
    }

    if (error) {
        return <p>Error: {error.message}</p>;
    }


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
            // text: 'TITLE',
        },
        yaxis: {
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

    return (
        <div className='w-full h-full p-5'>
            <Plot className='w-full h-full'
                data={props.data}
                layout={layout}
                config={config}
                revision={revise}
            />
        </div>
    );
};

export default GenerateGraph;
