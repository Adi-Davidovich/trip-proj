import { storageService } from './storage.servic.js'
import { mapService } from './map.service.js'
import { utilService } from './util-service.js'

export const locService = {
    getLocs,
    saveloc,
    deleteLoc,
    connectReverseGoogleGeocodeApi,
    searchLocation
}

const locs = storageService.loadFromStorage('locs') || [] 

function getLocs() {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            resolve(locs);
        }, 2000)
    });
}


function createNewLocation(lat, lng, title, weather = null, updatedAt = null) {
    var loc = {
        id: utilService.makeId(),
        title,
        lat,
        lng,
        weather,
        createdAt: Date.now(),
        updatedAt
    }
    locs.push(loc)
    const pos = { lat: loc.lat, lng: loc.lng };
    mapService.addMarker(pos, loc.title);
    storageService.saveToStorage('locs', locs)
}


function saveloc(lat, lng) {
    var title = document.querySelector(".save-loc").value
    createNewLocation(lat, lng, title)
}


function deleteLoc(locId) {
    const idx = locs.findIndex(loc => locId === loc.id)
    locs.splice(idx, 1);
    storageService.saveToStorage('locs', locs)
}


function searchLocation(searchValue) {
     _connectGoogleGeocodeApi(searchValue)
     .then(res => {
         const lat = res.lat;
         const lng = res.lng;
         const title = searchValue;
         createNewLocation(lat, lng, title);
         mapService.panTo(lat, lng);
     })
}


function _connectGoogleGeocodeApi(address) {
    const API_KEY = 'AIzaSyCc7Qnw5U_LAip2s7WPpW-1UBsMnil8DMA';
    return axios.get(`https://maps.googleapis.com/maps/api/geocode/json?address=${address}&key=${API_KEY}`)
        .then(res => {
            if(res.data.results.length > 0) {
                const {lat, lng} = res.data.results[0].geometry.location
                return {lat, lng}
            }
        })
}

function connectReverseGoogleGeocodeApi(lat,lng) {
    const API_KEY = 'AIzaSyCc7Qnw5U_LAip2s7WPpW-1UBsMnil8DMA';
    return axios.get(`https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${API_KEY}`)
        .then(res => {
                const locationNAme = res.data.results[0]['formatted_address']
                return locationNAme
        })
}


