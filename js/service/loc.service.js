export const locService = {
    getLocs,
    saveloc,
    deleteLoc
}
import { storageService } from './storage.servic.js'

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
    storageService.saveToStorage('locs', locs)
    console.log(locs)
}

function saveloc(lat, lng) {
    var title = document.querySelector(".save-loc").value
    creatNewLocation(lat, lng, gIdx++, title)
}

function deleteLoc(locId) {
    const idx = locs.findIndex(loc => locId === loc.id)
    locs.splice(idx, 1);
    console.log(locs)
    storageService.saveToStorage('locs', locs)
   
}
