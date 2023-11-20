import React, { useEffect, useState, useContext } from 'react';
import { DataIdContext } from '../../App';
import 'react-data-grid/lib/styles.css';
import DataGrid from 'react-data-grid';
import { AgGridReact } from "ag-grid-react";
import 'ag-grid-community/styles/ag-grid.css';
import "ag-grid-community/styles/ag-theme-alpine.css";


const DataTable = () => {
    const dataId = useContext(DataIdContext);

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [rows, setRows] = useState([]);
    const [columns, setColumns] = useState([]);
    const [displayColumns, setDisplayColumns] = useState([]);

    const [rowData] = useState([
        { make: "Toyota", model: "Celica", price: 35000 },
        { make: "Ford", model: "Mondeo", price: 32000 },
        { make: "Porsche", model: "Boxter", price: 72000 }
    ]);

    const [columnDefs] = useState([
        { field: "make" },
        { field: "model" },
        { field: "price" }
    ]);



    useEffect(() => {
        fetch("http://localhost:8000/get_file_data_columns?id=" + dataId, {
            method: "GET",
        })
            .then((response) => response.json())
            .then((data) => {
                let currColumns = []
                for (const entry of data) {
                    let columnName = entry[0].substring(3);
                    currColumns.push({ field: columnName })
                }
                setColumns(currColumns)
            })
            .catch((error) => {
                setError(error);
                setLoading(false);
                console.log(error)
            });

    }, []);

    useEffect(() => {
        fetch("http://localhost:8000/get_file_data?id=" + dataId, {
            method: "GET",
        })
            .then((response) => response.json())
            .then((data) => {
                let currRows = []
                for (const row of data) {
                    let currHash = {}
                    for (const i in columns) {
                        currHash[columns[i]['field']] = row[i]
                    }
                    currRows.push(currHash)
                }

                setRows(currRows)
                setDisplayColumns(columns)
            })
            .catch((error) => {
                setError(error);
                setLoading(false);
                console.log(error)
            });
    }, [columns]);

    useEffect(() => {
        if (rows.length !== 0) { setLoading(false) }
    }, [rows])

    if (loading) {
        return <p>Loading...</p>;
    }

    if (error) {
        return <p>Error: {error.message}</p>;
    }

    //<DataGrid className='h-full' columns={displayColumns} rows={rows} onRowsChange={setRows} />
    return (
        <div className="ag-theme-alpine-dark w-full h-full">
            <AgGridReact rowData={rows} columnDefs={displayColumns}></AgGridReact>
        </div>
    );
};

export default DataTable;

