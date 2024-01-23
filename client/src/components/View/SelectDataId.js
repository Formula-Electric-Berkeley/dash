import React, { useEffect, useState } from 'react';
import 'react-data-grid/lib/styles.css';
import Loading from '../Utils/Loading';
import Select from 'react-select';
import DataTable from './DataTable';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faMagnifyingGlassChart, faArrowRight } from '@fortawesome/free-solid-svg-icons'

const SelectDataId = () => {
    const [showTable, setShowTable] = useState(false);

    const [fileNames, setFileNames] = useState([]);
    const [selectedDataId, setSelectedDataId] = useState('');

    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch("https://ev.berkeley.edu/dash-backend/get_files_info", {
            method: "GET",
        })
            .then((response) => response.json())
            .then((data) => {
                setLoading(false);

                let currFiles = []
                let currFileNames = []
                let currFileNamesRaw = []
                for (const entry of data) {
                    currFiles.push({
                        'filename': entry[1],
                        'size': parseFloat(entry[2].toFixed(2)),
                        'uploadDate': entry[3],
                        'ID': entry[0],
                    })
                    currFileNames.push({
                        value: entry[0], label: entry[1] +
                            ` (${entry[0].replace(/dashdata/g, '')})`
                    })
                    currFileNamesRaw.push(entry[1])
                }

                setFileNames(currFileNames)
            })
            .catch((error) => {
                setLoading(false);
                console.log(error)
            });
    }, []);

    if (loading) {
        return <Loading />;
    }

    return (
        <>
            {!showTable ? (
                <div className='w-full h-full p-10'>
                    <div>
                        <h1 className='text-2xl'>Data Preview
                            <FontAwesomeIcon className='icon ml-3' icon={faMagnifyingGlassChart} /></h1>
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
                            onChange={(e) => setSelectedDataId(e.value)}
                        />
                        <button className='submit-btn' onClick={() => setShowTable(true)}>
                            Show Data Preview
                            <FontAwesomeIcon className='ml-2' icon={faArrowRight} />
                        </button>
                    </div>
                </div>
            ) : (
                <DataTable dataId={selectedDataId} />
            )}
        </>
    );
};

export default SelectDataId;
