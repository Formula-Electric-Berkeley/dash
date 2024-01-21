import React, { useEffect, useState } from 'react';
import Loading from '../Utils/Loading';

const Storage = () => {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [rows, setRows] = useState([]);

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

    return (
        <div className="h-full w-full">
            <div className='flex justify-between h-10 w-full mt-7 px-7'>
                <div className='text-center'>
                    <button className='w-full submit-btn'>UPLOAD DATA</button>
                </div>
                <div class="w-1/2 px-4 pr-0 flex flex-col justify-center">
                    <div class="w-full h-3 rounded-full bg-gray-600">
                        <div class="h-full rounded-full bg-emerald-600"
                            style={{ minWidth: "12px", width: "1%" }}
                        >
                        </div>
                    </div>
                    <h1 className='text-sm'>49 MB / 10 GB (00.01%)</h1>
                </div>
            </div>
            <table class="w-full px-7 border-separate border-spacing-y-6">
                <tr>
                    <th class="text-left text-m">FILENAME <i class="ml-2 table-heading-icon"></i></th>
                    <th class="text-center text-m">SIZE <i class="ml-2 table-heading-icon"></i></th>
                    <th class="text-right text-m">UPLOAD DATE <i class="ml-2 table-heading-icon"></i></th>
                </tr>
                {rows.map((item, index) => (
                    <tr>
                        <td class="text-m border-solid border-2 border-white border-r-0 font-medium">
                            <p class="m-3"><b>{item.filename}</b><br />ID: <p className='inline text-zinc-500'>{item.ID}</p></p>
                        </td>
                        <td class="text-m border-solid border-2 border-white border-l-0 border-r-0 text-center">
                            <p class="my-3"><code>{item.size} MB</code></p>
                        </td>
                        <td class="text-m border-solid border-2 border-white border-l-0 text-right italic">
                            <p class="m-3">{item.uploadDate}</p>
                        </td>
                    </tr>
                ))}
            </table>
        </div>
    );
};

export default Storage;

