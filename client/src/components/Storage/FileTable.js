import React, { useEffect, useState, useRef, useCallback, useContext } from 'react';
import { DataIdContext } from '../../App';
import 'react-data-grid/lib/styles.css';
import { AgGridReact } from "ag-grid-react";
import 'ag-grid-community/styles/ag-grid.css';
import "ag-grid-community/styles/ag-theme-alpine.css";
import Loading from '../Utils/Loading';

const FileTable = () => {
    const { dataId, setDataId } = useContext(DataIdContext);

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [rows, setRows] = useState([]);

    const columns = [
        { field: 'filename' },
        { field: 'size', flex: 0.6 },
        { field: 'uploadDate' },
        { field: 'ID', hide: false },
    ];

    const gridRef = useRef();

    const onSelectionChanged = useCallback(() => {
        const selectedRows = gridRef.current.api.getSelectedRows();
        setDataId(selectedRows[0].ID)
        console.log(dataId)
    }, []);

    useEffect(() => {
        fetch("http://localhost:8000/get_files_info", {
            method: "GET",
        })
            .then((response) => response.json())
            .then((data) => {
                setLoading(false);

                let currRows = []
                for (const entry of data) {
                    currRows.push({
                        'filename': entry[1],
                        'size': parseFloat(entry[2].toFixed(2)),
                        'uploadDate': entry[3],
                        'ID': entry[0].substring(8),
                    })
                }

                setRows(currRows)
            })
            .catch((error) => {
                setError(error);
                setLoading(false);
                console.log(error)
            });
    }, []);

    if (loading) {
        return <Loading />;
    }

    if (error) {
        return <p>Error: {error.message}</p>;
    }

    const defaultColDef = {
        flex: 1,
    };

    return (
        <div className="ag-theme-alpine-dark grow w-full">
            <AgGridReact
                ref={gridRef}
                defaultColDef={defaultColDef}
                rowData={rows}
                columnDefs={columns}
                rowSelection={'single'}
                onSelectionChanged={onSelectionChanged}
            >
            </AgGridReact>
        </div>
    );
};

export default FileTable;

