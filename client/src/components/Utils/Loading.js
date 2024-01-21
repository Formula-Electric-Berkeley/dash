import React from 'react';
import './Loading.css';

const Loading = () => {
    return (
        <div className="loading-box">
            <div className="road">
                <h1>LOADING...</h1>
                <div className="taxi">
                    <div className="light"></div>
                    <span>
                        <b></b>
                        <i></i>
                    </span>
                </div>
            </div>
        </div>
    );
};

export default Loading;
