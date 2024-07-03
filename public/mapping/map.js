const map = L.map('map').setView([0, 0], 2);
const attribution = '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
const tileURL = 'https://tile.openstreetmap.org/{z}/{x}/{y}.png'
const tiles = L.tileLayer(tileURL, {
    maxZoom: 19,
    attribution: attribution
}).addTo(map);
// const marker = L.marker([0,0]).addTo(map);

async function getData() {
    const response = await fetch('/api')
    const data = await response.json()
    console.log(data)
    
    for(item of data){
        const marker = L.marker([item.latitude, item.longitude]).addTo(map);

        const air = item.aq_json.list[0].main.aqi
        console.log(air)
        let quality = ''
        switch(air){
            case 1: quality = 'Good'
                        break;
            case 2: quality = 'Fair'
                        break;
            case 3: quality = 'Moderate'
                        break;
            case 4: quality = 'Poor'
                        break;
            case 5: quality = 'Very Poor'
                        break;
            default: quality = 'Can not determine'
        }


        const text = `Weather Report at ${item.latitude}°, ${item.longitude}°:
        Timezone: ${item.weather_json.timezone} ${item.weather_json.timezone_abbreviation}
        Temperature: ${item.weather_json.current.temperature_2m}°C
        AQI: ${quality}`

        marker.bindPopup(text)
        
    }
}

getData()
