import React, { useEffect, useContext, useState } from 'react';
import Plot from 'react-plotly.js';
import { DataIdContext } from '../../App';
import Loading from '../Utils/Loading';

const ScatterPlot = (props) => {
    const { dataId, setDataId } = useContext(DataIdContext);
    const [xValues, setXValues] = useState([]);
    const [yValues, setYValues] = useState([]);
    const [yColumnNames, setYColumnNames] = useState([]);

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const [dataTMP, setDataTMP] = useState([]);

    useEffect(() => {
        fetch("https://ev.berkeley.edu/dash-backend/get_column_data?column=col" + props.xColumnName + "&id=" + dataId, {
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

        fetch("https://ev.berkeley.edu/dash-backend/get_column_data?column=colgyroxs&id=" + dataId, {
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
    }, []);

    useEffect(() => {
        let yColumnNamesTmp = []
        for (const name of props.yColumnArray) {
            yColumnNamesTmp.push(name.name)
        }

        let allTraces = []
        for (const yColumnName of yColumnNamesTmp) {
            fetch("https://ev.berkeley.edu/dash-backend/get_column_data?column=col" + yColumnName + "&id=" + dataId, {
                method: "GET",
            })
                .then((response) => response.json())
                .then((data) => {
                    let currArray = []
                    for (const entry of data) {
                        currArray.push(entry[0])
                    }
                    let currentTrace =
                    {
                        x: xValues,
                        y: currArray,
                        type: 'scatter',
                        mode: 'markers',
                    };
                    allTraces.push(currentTrace)
                    //console.log(currentTrace)
                    // setDataTMP((dataTMP) => ([...dataTMP, currentFrame]))
                })
                .catch((error) => {
                    console.log(error)
                });
        }
        console.log(allTraces)
        setDataTMP(allTraces)
        console.log(dataTMP)
    }, [xValues])

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
        return <Loading/>;
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
