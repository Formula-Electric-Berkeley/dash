import React, { useState } from "react";

const Storage = () => {
    const [file, setFile] = useState()

    function handleChange(event) {
        setFile(event.target.files[0])
    }

    function handleSubmit(event) {
        event.preventDefault();

        const data = new FormData();
        data.append('file', file);
        data.append('filename', file.filename);

        fetch('http://localhost:8000/upload', {
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
                <h1>UPLOAD FILE</h1>
                <input type="file" onChange={handleChange} />
                <button type="submit">Upload</button>
            </form>
        </div>
    );
};

export default Storage;

