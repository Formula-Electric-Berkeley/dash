import React, { useState } from "react";

const UploadFile = () => {
    const [file, setFile] = useState()

    function handleChange(event) {
        setFile(event.target.files[0])
    }

    function handleSubmit(event) {
        event.preventDefault();

        const data = new FormData();
        data.append('file', file);
        data.append('filename', file.filename);

        fetch('https://ev.studentorg.berkeley.edu/dash-backend/run.fcgi/upload', {
            mode: "no-cors",
            method: 'POST',
            body: data,
        }).then((response) => {
            console.log(response)
        }).catch((error) => {
            window.alert("Error uploading file: ", error);
        });
    }

    return (
        <div>
            <form onSubmit={handleSubmit}>
                <input type="file" onChange={handleChange} />
                <button type="submit">Upload</button>
            </form>
        </div>
    );
};

export default UploadFile;

