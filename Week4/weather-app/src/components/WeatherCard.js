import React from "react";
import "../styles/WeatherCard.css"; // Import the CSS file for WeatherCard

function WeatherCard(props){
    const icon = require(`../icons/${props.icon}.svg`);

    return (
        <div className='weather-card'>
            <h5>{props.date}</h5>
            <img src={icon} alt={props.icon}/>
            <h3>{props.temp_range}</h3>
        </div>
    );
}

export default WeatherCard;