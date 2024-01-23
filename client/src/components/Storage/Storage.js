import React, { useEffect, useState, useRef } from 'react';
import Loading from '../Utils/Loading';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowUpFromBracket, faXmark } from '@fortawesome/free-solid-svg-icons'

const Storage = () => {
    const [file, setFile] = useState();
    const [dbUsageSize, setDbUsageSize] = useState();

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [rows, setRows] = useState([]);

    const formRef = useRef();

    useEffect(() => {
        fetch("http://localhost:8000/get_db_size_usage", {
            method: "GET",
        })
            .then((response) => response.json())
            .then((data) => {
                setDbUsageSize(data);
            })
            .catch((error) => {
                setError(error);
                setLoading(false);
                console.log(error)
            });
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

    function handleChange(event) {
        if (window.confirm(`Confirm upload for:\n
            ${event.target.files[0].name}`)) {
            setLoading(true);

            setFile(event.target.files[0]);
            event.preventDefault();

            const data = new FormData();
            data.append('file', event.target.files[0]);
            data.append('filename', event.target.files[0].filename);

            fetch('http://localhost:8000/upload', {
                mode: "no-cors",
                method: 'POST',
                body: data,
            }).then((response) => {
                setLoading(false);
                if (window.confirm("Uploaded Successfully!!!\n\nDo you want to reload the page to reflect your changes?\nNOTE: Your current layout will not be saved!")) {
                    window.location.reload()
                }
                setLoading(false);
            }).catch((error) => {
                window.alert("Error uploading file: ", error);
            });
        }
    }

    const deleteDataRecord = (deleteRecordID, deleteRecordFilename, deleteRecordUploadDate) => {
        if (window.confirm(`Are you sure you want to delete this data?\nThis action cannot be undone.\n
            FILE: ${deleteRecordFilename}
            UPLOAD DATE: ${deleteRecordUploadDate}`)) {
            console.log(deleteRecordID)
            fetch("http://localhost:8000/delete?id=dashdata" + deleteRecordID, {
                method: "GET",
            })
                .then((response) => response.json())
                .then((data) => {
                    console.log(data)
                    if (window.confirm("Do you want to reload the page to reflect your changes?\nNOTE: Your current layout will not be saved!")) {
                        window.location.reload()
                    }
                })
                .catch((error) => {
                    setError(error);
                    console.log(error)
                });
        }
    }

    if (loading) {
        return <Loading />;
    }

    if (error) {
        return <p>Error: {error.message}</p>;
    }

    return (
        <div className="h-full w-full">
            <div className='flex justify-between h-15 w-full mt-7 px-7'>
                <div className='flex justify-center items-center text-center'>
                    <form ref={formRef}>
                        <label htmlFor="filePicker"
                            className='submit-btn hover:cursor-pointer'>
                            Upload Data
                            <FontAwesomeIcon className='ml-2' icon={faArrowUpFromBracket} />
                        </label>
                        <input id="filePicker" onChange={handleChange}
                            className="hidden" type={"file"} />
                    </form>
                </div>
                <div class="w-1/2 px-4 pr-0 flex flex-col justify-center">
                    <div class="w-full h-3 rounded-full bg-gray-600">
                        <div class="h-full rounded-full bg-emerald-600"
                            style={{ minWidth: "12px", width: `${dbUsageSize / 10 * 100}%` }}
                        >
                        </div>
                    </div>
                    <h1 className='text-sm'>{dbUsageSize} GB / 10 GB ({`${Math.round(dbUsageSize / 10 * 100 * 100) / 100}%`})</h1>
                </div>
            </div>
            <table class="w-full px-7 pr-12 border-separate border-spacing-y-6">
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
                            <p class="m-3 mr-0">{item.uploadDate}
                                <i onClick={() => { deleteDataRecord(item.ID, item.filename, item.uploadDate) }}>
                                    <FontAwesomeIcon
                                        className='text-zinc-500 hover:text-red-600 duration-300 relative left-7
                                        text-xl hover:cursor-pointer'
                                        icon={faXmark} />
                                </i>
                            </p>
                        </td>
                    </tr>
                ))}
            </table>
        </div>
    );
};

export default Storage;

