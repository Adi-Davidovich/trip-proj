export const locService = {
    getLocs,
    saveloc,
    deleteLoc,
    searchLocation
}
import { storageService } from './storage.servic.js'
import { mapService } from './map.service.js'

var gIdx = 0

const locs = storageService.loadFromStorage('locs') || [] 

function getLocs() {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            resolve(locs);
        }, 2000)
    });
}


function creatNewLocation(lat, lng, id, title, weather = null, createdAt = Date.now(), updatedAt = null) {
    var loc = {
        id,
        title,
        lat,
        lng,
        weather,
        createdAt,
        updatedAt
    }
    locs.push(loc)
    mapService.addMarker({ lat, lng });
    storageService.saveToStorage('locs', locs)
    console.log(locs)
}


function saveloc(lat, lng) {
    var title = document.querySelector(".save-loc").value
    creatNewLocation(lat, lng, gIdx++, title)
    infoWindow.close(gMap);
}


function deleteLoc(locId) {
    const idx = locs.findIndex(loc => locId === loc.id)
    locs.splice(idx, 1);
    console.log(locs)
    storageService.saveToStorage('locs', locs)
}


function searchLocation(searchValue) {
     _connectGoogleGeocodeApi(searchValue)
     .then(res => {
         console.log(res.lat);
         const lat = res.lat
         const lng = res.lng
         const title = searchValue
         creatNewLocation(lat, lng, gIdx++, title)
         mapService.panTo(lat, lng);
     })
}


function _connectGoogleGeocodeApi(address) {
    const API_KEY = 'AIzaSyCc7Qnw5U_LAip2s7WPpW-1UBsMnil8DMA';
    return axios.get(`https://maps.googleapis.com/maps/api/geocode/json?address=${address}&key=${API_KEY}`)
        .then(res => {
            console.log(res);
            if(res.data.results.length > 0) {
                const {lat, lng} = res.data.results[0].geometry.location
                return {lat, lng}
            }
        })
}
