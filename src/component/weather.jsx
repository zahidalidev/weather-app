import React, { Component } from 'react';
import { GoSearch } from 'react-icons/go';
import axios from "axios";
import Clock from 'react-live-clock';

import 'bootstrap/dist/css/bootstrap.min.css';
import "../component/indexWeather.css";

const api = {
    key: "9180224dadc2d75d670bc2b003ac2e24",
    base: "https://api.openweathermap.org/data/2.5/"
}


class Weather extends Component {
    state = { 
        query: 'lahore',
        weather: {},
        country: "",
        temp: '',
        feels_like: '',
        main: '',
        icon: '',
        date: new Date(),
        description: '',
        temp_min: '',
        temp_max: '',
        wind_speed: '',
        wind_degree: '',
        humidity: '',
        pressure: '',
        coord: {},
        dt: 0,
        sunrise: '',
        sunset: ''
     }
  
    getWeather = async() => {
        const {data: weather} = await axios.get(`${api.base}weather?q=${this.state.query}&units=metric&APPID=${api.key}`);
        this.setState({
            weather,
            country: weather.sys.country, 
            temp: weather.main.temp,
            feels_like: weather.main.feels_like,
            main: weather.weather[0].main,
            icon: weather.weather[0].icon,
            description: weather.weather[0].description,
            temp_min: weather.main.temp_min,
            temp_max: weather.main.temp_max,
            wind_speed: weather.wind.speed,
            wind_degree: weather.wind.deg,
            humidity: weather.main.humidity,
            pressure: weather.main.pressure,
            coord: weather.coord,
            dt: weather.dt
        });
        await this.getPrayers();
        console.log("weather", weather);
    }

    getPrayers = async() => {
        const {dt, coord} = this.state;
        const apiPrayer = `http://api.aladhan.com/v1/timings/${dt}?latitude=${coord.lat}&longitude=${coord.lon}&method=2`;
        const {data: prayer} = await axios.get(apiPrayer);
        console.log("prayer", prayer.data.timings);
        this.setState({
            sunrise: prayer.data.timings.Sunrise,
            sunset: prayer.data.timings.Sunset
        })
    }

    async componentDidMount(){
        await this.getWeather();
        await this.getPrayers();
        setInterval(
            () => this.setState({ date: new Date() }),
            1000
        );
    }
    
    dateBuilder = (d) => {
        let months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
        let days = ["Sunday","Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

        let day = days[d.getDay()];
        let date = d.getDate();
        let month = months[d.getMonth()];
        let year = d.getFullYear();

        return `${day} ${date} ${month} ${year}`;
    }

    weatherImage = () => {
        const {main} = this.state;
        if(main === "Smoke"){
            return "Smoke";
        }else if(main === "Clouds"){
            return "Clouds"
        }else if(main === "Haze"){
            return "Haze"
        }else if(main === "Drizzle"){
            return "Drizzle"
        }else if(main === "Rain"){
            return "Rain"
        }else if(main === "Snow"){
            return "Snow"
        }else{
            return "Normal"
        }
    }

    render() { 
        
        const {weather, country, temp, main, icon, description, feels_like, temp_min, temp_max, wind_speed, wind_degree, humidity, pressure, sunrise, sunset} = this.state;
        return ( 
          <div className={this.weatherImage()} >
              
            <main className="main-class ">
                <div className="row justify-content-center"> 
                    <div className="container mt-3 col-md-6">
                        <div className="input-group search-bar">
                            <input 
                                type="text" 
                                className="form-control" 
                                placeholder="Search City..." 
                                onChange={e=>this.setState({query: e.target.value})}
                            />
                            <div className="input-group-append">
                                <button style={{backgroundColor: "rgb(103, 119, 239)"}} onClick={this.getWeather} className="btn btn-primary" type="submit"><GoSearch /></button>  
                            </div>
                        </div>
                    </div>
                </div>
                <div className="row justify-content-center">
                	<div className="mt-5" style={{ whiteSpace: "nowrap"}}>	
                        <div className="location-box">
                            <div className="location">{weather.name}, {country}</div>
                            <div className="date">{this.dateBuilder(new Date())}</div>
                            <Clock className="date" format={'HH:mm:ssa'} ticking={true} />
                        </div>
                	</div>
                </div>

                {/* <div className="row mt-3 weather-box" >
                	<div className="temp weather-box col-md-5">	
                        <div className="temp">
                            {temp}°C
                            <p style={{fontSize: 17}}>Feels like: {feels_like}°C</p>
                        </div>
                        <div className="col-md-7" style={{marginTop: -239, marginLeft: 250}}>
                            <div className="weather-box" >
                                <img style={{marginTop: 50, marginLeft: -50}} src={`http://openweathermap.org/img/wn/${icon}@2x.png`} width="100px" height="100px" alt=""></img>
                                <div style={{marginTop: -80, marginLeft: 50}} className="weather" >{main}</div>
                            </div>
                            <div className="weather" style={{marginBottom: 60, marginTop: 20, fontSize: 20, color: "white", whiteSpace: "nowrap"}} >Description: <span style={{color: "white", fontWeight: 700, fontSize: 18}}>{description}</span></div>
                        </div>
                	</div>
                </div> */}
                <div className="row weather-box justify-content-center" >
                    <div className="col-md-6 temp">
                        <div className="temp">
                            {temp}°C
                            <p style={{fontSize: 17}}>Feels like: {feels_like}°C</p>
                        </div>
                    <div className="col-md-6">
                        <div className="weather-box" >
                            <img style={{marginTop: -420, marginLeft: 310}} src={`http://openweathermap.org/img/wn/${icon}@2x.png`} width="100px" height="100px" alt=""></img>
                            <div style={{marginTop: -280, marginLeft: 410}} className="weather weather1" >{main}</div>
                            <div className="weather weatherD" style={{  fontWeight: 300, marginTop: 10, marginLeft: 330, fontSize: 20, color: "rgba(255, 255, 255, 0.5)", whiteSpace: "nowrap"}} >Description: <span style={{color: "rgba(255, 255, 255, 0.8)", fontWeight: 600, fontSize: 18}}>{description}</span></div>
                            <h6 className="weatherMi" style={{marginTop: 10, whiteSpace: "nowrap" ,marginLeft: 345, color: "rgba(255, 255, 255, 0.5)" }}>min: <span style={{color: "rgba(255, 255, 255, 0.8)", fontWeight: 600, fontSize: 15}}>{temp_min}°C</span></h6>
                            <h6 className="weatherMa" style={{marginTop: -27, whiteSpace: "nowrap" ,marginLeft: 438, color: "rgba(255, 255, 255, 0.5)" }}>max: <span style={{color: "rgba(255, 255, 255, 0.8)", fontWeight: 600, fontSize: 15}}>{temp_max}°C</span></h6>

                        </div>
                            <div className="weather weatherDot" style={{ marginTop: -40, marginLeft: 200, fontSize: 15, color: "black", whiteSpace: "nowrap"}} >.</div>
                        </div>
                    </div>
                </div>
                <div className="row justify-content-center">
                    <div className="col-md-2">
                        <h6 style={{color: "rgba(255, 255, 255, 0.5)" }}>Wind Speed: {wind_speed} m/s</h6>
                        <h6 style={{color: "rgba(255, 255, 255, 0.5)" }}>degree: {wind_degree}</h6>
                    </div>
                    <div className="col-md-2">
                        <h6 style={{color: "rgba(255, 255, 255, 0.5)" }}>Humidity: {humidity} %</h6>
                        <h6 style={{color: "rgba(255, 255, 255, 0.5)" }}>Pressure: {pressure} hPa</h6>
                    </div>
                    <div className="col-md-2">
                        <h6 style={{color: "rgba(255, 255, 255, 0.5)" }}>Sunrise: {sunrise}</h6>
                        <h6 style={{color: "rgba(255, 255, 255, 0.5)" }}>Sunset: {sunset}</h6>
                    </div>
                </div>

            </main>
          </div>      
         );
    }
}
 
export default Weather;