import React, { useEffect, useState, useContext } from 'react';
import 'react-data-grid/lib/styles.css';
import DataGrid from 'react-data-grid';
import { CurrentDataContext } from '../../App';

const DataTable = () => {
    const { currentDataId, setCurrentDataId } = useContext(CurrentDataContext);

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [rows, setRows] = useState([]);
    const [columns, setColumns] = useState([]);
    const [displayColumns, setDisplayColumns] = useState([]);

    useEffect(() => {
        fetch("http://localhost:8000/get_file_data_columns?id=" + currentDataId, {
            method: "GET",
        })
            .then((response) => response.json())
            .then((data) => {
                let currColumns = []
                for (const entry of data) {
                    let columnName = entry[0].substring(3);
                    currColumns.push({ key: columnName, name: columnName })
                }
                setColumns(currColumns)
            })
            .catch((error) => {
                setError(error);
                setLoading(false);
                console.log(error)
            });

    });

    useEffect(() => {
        fetch("http://localhost:8000/get_file_data?id=", + currentDataId, {
            method: "GET",
        })
            .then((response) => response.json())
            .then((data) => {
                let currRows = []
                for (const row of data) {
                    let currHash = {}
                    for (const i in columns) {
                        currHash[columns[i]['key']] = row[i]
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

    if (currentDataId === null) {
        return <p>Select data source</p>;
    }

    if (loading) {
        return <p>Loading...</p>;
    }

    if (error) {
        return <p>Error: {error.message}</p>;
    }

    return (
        <div>
            <DataGrid columns={displayColumns} rows={rows} onRowsChange={setRows} />
        </div>
    );
};

export default DataTable;

