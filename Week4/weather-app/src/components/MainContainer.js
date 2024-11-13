import React, { useState, useEffect } from "react";
import "../styles/MainContainer.css"; // Import the CSS file for MainContainer

import WeatherCard from './WeatherCard';

function MainContainer(props) {

  function formatDate(daysFromNow = 0) {
    let output = "";
    var date = new Date();
    date.setDate(date.getDate() + daysFromNow);
    output += date.toLocaleString("en-US", { weekday: "long" }).toUpperCase();
    output += " " + date.getDate();
    return output;
  }

  /*
  STEP 1: IMPORTANT NOTICE!

  Before you start, ensure that both App.js and SideContainer.js are complete. The reason is MainContainer 
  is dependent on the city selected in SideContainer and managed in App.js. You need the data to flow from 
  App.js to MainContainer for the selected city before making an API call to fetch weather data.
  */
  
  /*
  STEP 2: Manage Weather Data with State.
  
  Just like how we managed city data in App.js, we need a mechanism to manage the weather data 
  for the selected city in this component. Use the 'useState' hook to create a state variable 
  (e.g., 'weather') and its corresponding setter function (e.g., 'setWeather'). The initial state can be 
  null or an empty object.
  */
  const [weather, setWeather] = useState(null)
  
  
  /*
  STEP 3: Fetch Weather Data When City Changes.
  
  Whenever the selected city (passed as a prop) changes, you should make an API call to fetch the 
  new weather data. For this, use the 'useEffect' hook.

  The 'useEffect' hook lets you perform side effects (like fetching data) in functional components. 
  Set the dependency array of the 'useEffect' to watch for changes in the city prop. When it changes, 
  make the API call.

  After fetching the data, use the 'setWeather' function from the 'useState' hook to set the weather data 
  in your state.
  */
  useEffect(() => {
    const makeApiCall = async () => {
      const city = props.selectedCity
      const response = await fetch(`https://api.openweathermap.org/data/2.5/forecast?lat=${city.lat}&lon=${city.lon}&units=imperial&appid=${props.apiKey}`);
      const data = await response.json();
      setWeather(data); // Update the weather state with the fetched data
      console.log(data)
      //renderWeatherResults()
    };
    if(props.selectedCity){
      makeApiCall();
    }
  }, [props.selectedCity]);

  function renderWeatherResults() {
    if(weather.list){
      // Filter out every 5th entry from the forecast list
      const filteredWeather = weather.list.filter((_, index) => index % 5 === 0).slice(0, 5);

      return filteredWeather.map((data, index) => {
        const date = formatDate(index);
        const icon = data.weather[0].icon
        const degree = '\u00B0';
        const temp_range = Math.round(data.main.temp_min) + `${degree}F - ` + Math.round(data.main.temp_max) + `${degree}F`

        return (
          <WeatherCard key={data.dt} date={date} icon={icon} temp_range={temp_range}/>
        )
      })
    }
  }
  
  
  return (
    <div id="main-container">
      <div id="weather-container">
        {/* 
        STEP 4: Display Weather Data.
        
        With the fetched weather data stored in state, use conditional rendering (perhaps the ternary operator) 
        to display it here. Make sure to check if the 'weather' state has data before trying to access its 
        properties to avoid runtime errors. 

        Break down the data object and figure out what you want to display (e.g., temperature, weather description).
        This is a good section to play around with React components! Create your own - a good example could be a WeatherCard
        component that takes in props, and displays data for each day of the week.
        */}
        {weather && 
        (<div>
          <h3>{formatDate(0)}</h3>
          <h1>Weather for {props.selectedCity.fullName}</h1>
          <div className='weather-card-section'>
            {renderWeatherResults()}
          </div>
        </div>
      )}
      </div>
    </div>
  );
}


export default MainContainer;

