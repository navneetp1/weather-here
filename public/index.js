const button = document.querySelector('#geolocate')
const lat = document.querySelector('#lat')
const lon = document.querySelector('#lon')
const timezone = document.querySelector('#timezone')
const temp = document.querySelector('#temp')
const maxTemp = document.querySelector('#max-temp')
const minTemp = document.querySelector('#min-temp')
const feelTemp = document.querySelector('#feel-temp')
const quality = document.querySelector('#quality')
const pm = document.querySelector('#pm-10')

function getTimeZoneAbbreviation() {
    const date = new Date();
    const options = { timeZoneName: 'short' };
    const formatter = new Intl.DateTimeFormat('en-US', options);
    const formatted = formatter.format(date);
    const abbreviation = formatted.match(/\b[A-Z]{1,4}\b/g)[0];  // Extract abbreviation
    return abbreviation;
}



if("geolocation" in navigator){

    button.addEventListener("click", () => {
        navigator.geolocation.getCurrentPosition(async position => {

            try {
                const latitude = position.coords.latitude.toFixed(4);
                const longitude = position.coords.longitude.toFixed(4);
        
                lat.textContent = latitude
                lon.textContent = longitude
                // const zone = getTimeZoneAbbreviation()
                // console.log(zone)
                
                const api_url = `/weather/${latitude},${longitude}`
                const weather_response = await fetch(api_url)
                const weather_json = await weather_response.json()
                // console.log(weather_json)
                
    
                timezone.textContent = `${weather_json.timezone} ${weather_json.timezone_abbreviation}`
                temp.textContent = `${weather_json.current.temperature_2m}°C`
                maxTemp.textContent = `${weather_json.daily.temperature_2m_max[6]}°C`
                minTemp.textContent = `${weather_json.daily.temperature_2m_min[0]}°C`
                feelTemp.textContent = `${weather_json.daily.apparent_temperature_max[6]}°C`
    
    
                const aq_response = await fetch(`/air-quality/${latitude},${longitude}`)
                const aq_json = await aq_response.json()
                // console.log(aq_json)
                const air = aq_json.list[0].main.aqi
                switch(air){
                    case 1: quality.textContent = 'Good'
                                break;
                    case 2: quality.textContent = 'Fair'
                                break;
                    case 3: quality.textContent = 'Moderate'
                                break;
                    case 4: quality.textContent = 'Poor'
                                break;
                    case 5: quality.textContent = 'Very Poor'
                                break;
                    default: quality.textContent = 'Can not determine'
                }
    
                pm.textContent = `${aq_json.list[0].components.pm10} μg/m³`
                
    
                const data = {
                    latitude,
                    longitude,
                    weather_json,
                    aq_json
                }
    
                options = {
                    method: 'POST',
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify(data)
                }
    
                const response = await fetch('/api', options)
                const json = await response.json()
                // console.log(json)
            }catch(error){
                console.log(error)
            }
            
        })
    })
}
else{
    console.log("Geolocation unavailable")
}