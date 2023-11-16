import React from 'react';
import 'react-data-grid/lib/styles.css';
import DataGrid from 'react-data-grid';

const FileTable = () => {
    const columns = [
        { key: 'filename', name: 'Filename' },
        { key: 'size', name: 'Size' },
        { key: 'uploadDate', name: 'Upload Date' }
    ];

    const rows = [
//         { id: 0, title: 'Example' },
//         { id: 1, title: 'Demo' }
    ];

    return (
        <div>
            <DataGrid columns={columns} rows={rows} />
        </div>
    );
};

export default FileTable;

