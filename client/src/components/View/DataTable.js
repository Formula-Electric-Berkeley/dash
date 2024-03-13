import React, { useEffect, useState } from 'react';
import 'react-data-grid/lib/styles.css';
import { AgGridReact } from "ag-grid-react";
import 'ag-grid-community/styles/ag-grid.css';
import "ag-grid-community/styles/ag-theme-alpine.css";
import Loading from '../Utils/Loading';

const DataTable = (props) => {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [rows, setRows] = useState([]);
    const [columns, setColumns] = useState([]);
    const [displayColumns, setDisplayColumns] = useState([]);

    useEffect(() => {
        fetch("https://ev.studentorg.berkeley.edu/dash-backend/run.fcgi/get_file_data_columns?id=" + props.dataId, {
            method: "GET",
        })
            .then((response) => response.json())
            .then((data) => {
                let currColumns = []
                for (const entry of data) {
                    let columnName = entry.substring(3);
                    currColumns.push({ field: columnName })
                }
                setColumns(currColumns)
            })
            .catch((error) => {
                setError(error);
                setLoading(false);
                console.log(error)
            });

    }, [props.dataId]);

    useEffect(() => {
        fetch("https://ev.studentorg.berkeley.edu/dash-backend/run.fcgi/get_file_data?id=" + props.dataId, {
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
    }, [columns, props.dataId]);

    useEffect(() => {
        if (rows.length !== 0) { setLoading(false) }
    }, [rows])

    if (loading) {
        return <Loading/>;
    }

    if (error) {
        return <p>Error: {error.message}</p>;
    }

    return (
        <div className="ag-theme-alpine-dark w-full h-full">
            <AgGridReact
                rowData={rows}
                columnDefs={displayColumns}
            >
            </AgGridReact>
        </div>
    );
};

export default DataTable;

