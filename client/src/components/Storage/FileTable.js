import React, { useEffect, useState } from 'react';
import 'react-data-grid/lib/styles.css';
import { AgGridReact } from "ag-grid-react";
import 'ag-grid-community/styles/ag-grid.css';
import "ag-grid-community/styles/ag-theme-alpine.css";

const FileTable = () => {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [rows, setRows] = useState([]);

    const columns = [
        { field: 'filename' },
        { field: 'size' },
        { field: 'uploadDate' }
    ];

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
                        'uploadDate': entry[3]
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
        return <p>Loading...</p>;
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
                defaultColDef={defaultColDef}
                rowData={rows}
                columnDefs={columns}>
            </AgGridReact>
        </div>
    );
};

export default FileTable;

