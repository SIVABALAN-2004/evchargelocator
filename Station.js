import React from 'react'
import '../index.css';
import { useNavigate } from 'react-router-dom';

function Station({station}) {
    const navigate = useNavigate();
    

  return (
    <>
    <div key={station.id} className={`station-card ${station.isBusy ? 'busy' : ''}`} onClick={() => navigate(`/reserve/${station.id}`)}>
                    <h3>{station.name}</h3>
                    <p>{station.location}</p>
                </div>
    
    </>
  )
}

export default Station