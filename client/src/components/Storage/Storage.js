import React from "react";
import UploadFile from "./UploadFile";
import FileTable from "./FileTable";

const Storage = () => {
    return (
        <div className="h-full w-full flex flex-col">
            <UploadFile/>
            <FileTable/>
        </div>
    );
};

export default Storage;

