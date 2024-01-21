import React, { useState, useEffect } from 'react';
import './Graph.css';
import Loading from '../Utils/Loading';
import Select from 'react-select';

const TraceForm = (props) => {
    const [fileNames, setFileNames] = useState([]);
    const [axisOptions, setAxisOptions] = useState([]);

    const [traceName, setTraceName] = useState(props.index ? 'Trace ' + props.index : 'Trace');
    const [sourceDataId, setSourceDataId] = useState('');
    const [graphType, setGraphType] = useState('');
    const [xAxis, setXAxis] = useState('');
    const [yAxis, setYAxis] = useState('');

    useEffect(() => {
        fetch("http://localhost:8000/get_files_info", {
            method: "GET",
        })
            .then((response) => response.json())
            .then((data) => {
                let currFiles = []
                let currFileNames = []
                for (const entry of data) {
                    currFiles.push({
                        'filename': entry[1],
                        'size': parseFloat(entry[2].toFixed(2)),
                        'uploadDate': entry[3],
                        'ID': entry[0],
                    })
                    currFileNames.push({
                        value: entry[0], label: entry[1] +
                            ` (${entry[0].replace(/dashdata/g, '')})`})
                    }

                setFileNames(currFileNames)
            })
            .catch((error) => {
                console.log(error)
            });
    }, []);

    useEffect(() => {
        fetch("http://localhost:8000/get_file_data_columns?id=" + sourceDataId, {
            method: "GET",
        })
            .then((response) => response.json())
            .then((data) => {
                let currElements = []
                for (const entry of data) {
                    let columnName = entry.substring(3);
                    currElements.push({ value: columnName, label: columnName })
                }
                setAxisOptions(currElements)
            })
            .catch((error) => {
                console.log(error)
            });

    }, [sourceDataId]);

    useEffect(() => {
        const newData = {
            traceName: traceName,
            sourceDataId: sourceDataId,
            graphType: graphType,
            xAxis: xAxis,
            yAxis: yAxis,
        }

        props.onDataChange(props.index, newData)

    }, [traceName, sourceDataId, graphType, xAxis, yAxis]);

    return (
        <div>
            <input className='bg-transparent text-white outline-none border-none' name="traceName" value={traceName}
                onChange={e => setTraceName(e.target.value)} />
            <hr />
            <Select
                className='my-5'
                styles={{
                    option: (baseStyles, state) => ({
                        ...baseStyles,
                        color: 'black',
                        backgroundColor: state.isFocused || state.isSelected ? '#fbb414' : null,
                    }),
                }}
                options={fileNames}
                placeholder={<div>Data Source</div>}
                onChange={(e) => setSourceDataId(e.value)}
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
                options={[{ value: 'scatter', label: 'Scatter Plot' },
                { value: 'line', label: 'Line Chart' }]}
                placeholder={<div>Graph Type</div>}
                onChange={(e) => setGraphType(e.value)}
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
                options={axisOptions}
                placeholder={<div>X-Axis</div>}
                onChange={(e) => setXAxis(e.value)}
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
                options={axisOptions}
                placeholder={<div>Y-Axis</div>}
                onChange={(e) => setYAxis(e.value)}
            />
        </div >
    );
};

export default TraceForm;
