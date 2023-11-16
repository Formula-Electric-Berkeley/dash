import React, { useState } from "react";
import UploadFile from "./UploadFile";
import FileTable from "./FileTable";

const Storage = () => {
    return (
        <div>
            <UploadFile/>
            <FileTable/>
        </div>
    );
};

export default Storage;

