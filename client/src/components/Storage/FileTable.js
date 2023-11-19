import React, { useEffect, useState } from 'react';
import 'react-data-grid/lib/styles.css';
import DataGrid from 'react-data-grid';

const FileTable = () => {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [rows, setRows] = useState([]);

    const columns = [
        { key: 'filename', name: 'Filename' },
        { key: 'size', name: 'Size' },
        { key: 'uploadDate', name: 'Upload Date' }
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

    return (
        <div>
            <DataGrid columns={columns} rows={rows} onRowsChange={setRows} />
        </div>
    );
};

export default FileTable;

