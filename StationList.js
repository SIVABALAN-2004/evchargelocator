import React from 'react';
// import { useNavigate } from 'react-router-dom';
import '../index.css';
import Station from './Station';

const StationList = ({ stations }) => {
    // const navigate = useNavigate();

    return (
        <div className="station-list">
            {stations.map(station => (
                <Station station={station}/>
            ))}
        </div>
    );
};

export default StationList;
