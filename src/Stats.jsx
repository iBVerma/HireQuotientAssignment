import React, { useState } from 'react'

function Stats(props) {
  const statsBoxStyle = {
    borderRadius: "5px",
    paddingLeft:"10px",
    paddingRight:"10px",
    transition: 'transform 0.3s ease-in-out',
    cursor: 'pointer',
  };

  const statsContainerStyle = {
    display: 'flex',
    justifyContent: 'space-around',
    gap:"50px"
  };
  // const colors = ['#FFD700', '#4169E1', '#32CD32']; 

  const handleBoxHover = (index) => {
    const element = document.getElementById(`stats-box-${index}`);
    element.style.transform = 'scale(1.05)';
  };

  const handleBoxLeave = (index) => {
    const element = document.getElementById(`stats-box-${index}`);
    element.style.transform = 'scale(1)';
  };

  const colors = ['#3498db', '#2ecc71', '#9b59b6'];

  return (
    <div style={statsContainerStyle}>
      <div
        id="stats-box-1"
        style={{ ...statsBoxStyle, backgroundColor: colors[0] }}
        onMouseEnter={() => handleBoxHover(1)}
        onMouseLeave={() => handleBoxLeave(1)}
      >
        <h4 style={{ color: '#333'}}>Total Users: {props.totalusers}</h4>
      </div>
      <div
        id="stats-box-2"
        style={{ ...statsBoxStyle, backgroundColor: colors[0] }}
        onMouseEnter={() => handleBoxHover(2)}
        onMouseLeave={() => handleBoxLeave(2)}
      >
        <h4 style={{ color: '#333' }}>Admins: {props.admins}</h4>
      </div>
      <div
        id="stats-box-3"
        style={{ ...statsBoxStyle, backgroundColor: colors[0] }}
        onMouseEnter={() => handleBoxHover(3)}
        onMouseLeave={() => handleBoxLeave(3)}
      >
        <h4 style={{ color: '#333' }}>Members: {props.members}</h4>
      </div>
    </div>
  );
}

export default Stats;
    