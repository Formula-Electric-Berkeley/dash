import React from 'react';
import Plot from 'react-plotly.js';

const ScatterPlot = () => {
    let data = [
        {
            x: [1, 2, 3],
            y: [2, 6, 3],
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
                text: 'TIME',
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
            <Plot className='w-full h-full' data={data} layout={layout} config={config} />
        </div>
    );
};

export default ScatterPlot;
