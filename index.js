import express from "express"
import Datastore from "nedb"
import "dotenv/config"

const api_key = process.env.API_KEY


const app = express()
const database = new Datastore('database.db')
database.loadDatabase()
app.use(express.static('public'))
app.use(express.json({ limit: '1mb' }))


app.get('/api', (request, response) => {
    database.find({}, (err, data) => {
        if(err){
            response.end()
            return;
        }

        response.json(data)
    })
})

app.get('/air-quality/:latlon', async (request, response) => {

    const latLon = request.params.latlon.split(',')
    const latitude = latLon[0]
    const longitude = latLon[1]

    const fetch_response = await fetch(`http://api.openweathermap.org/data/2.5/air_pollution?lat=${latitude}&lon=${longitude}&appid=${api_key}`)
    const json = await fetch_response.json()
    response.json(json)
})

app.post('/api', (request, response) => {
    // console.log(request.body)
    const data = request.body
    const lastUpdated = Date.now()

    data.lastUpdated = lastUpdated

    database.insert(data)

    response.json(data)
})




app.get('/weather/:latlon', async (request, response) => {
    
    const latLon = request.params.latlon.split(',')
    const latitude = latLon[0]
    const longitude = latLon[1]


    
    const API_URL =  `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&timezone=IST&current=temperature_2m&daily=temperature_2m_max,temperature_2m_min,apparent_temperature_max`
    const fetch_response = await fetch(API_URL)
    const json = await fetch_response.json()
    response.json(json)

})

app.listen(3000, () => {
    console.log('Listening on port 3000')
})
