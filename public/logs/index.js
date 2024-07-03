const logsMain = document.querySelector('#logs-main')

async function getData(){
    const response = await fetch('/api')
    const data = await response.json()
    console.log(data)

    for(item of data){
        const root = document.createElement('div')
        root.setAttribute('id', "root")
        const lat = document.createElement('div')
        const lon = document.createElement('div')
        const time = document.createElement('div')

        lat.textContent = `Latitude: ${item.latitude}`
        lon.textContent = `Longitude: ${item.longitude}`

        const timestamp = new Date(item.lastUpdated).toLocaleString()
        time.textContent = `Time: ${timestamp}`
        
        root.append(lat, lon, time)
        logsMain.appendChild(root)
    }
    
}

getData()