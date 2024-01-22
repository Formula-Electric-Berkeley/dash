import React from 'react';
import './Loading.css';

const Loading = () => {
    return (
        <div className="loading-box h-full">
            <div className="road h-full">
                <h1 className='top-8'>LOADING...</h1>
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
