export const locService = {
    getLocs,
    saveloc
}
import { storageService } from './storage.servic.js'

window.renderLoc = renderLoc;
var gIdx = 0

const locs = [];

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
    renderLoc()
}

function saveloc(lat, lng) {
    var title = document.querySelector(".save-loc").value
    creatNewLocation(lat, lng, gIdx++, title)
}

function renderLoc() {
    if (!locs) return;
    var Htmls = locs.map(loc => {
        return `<tr>
        <td>${loc.title}</td>
        <td>${loc.lat, loc.lng}</td>
        </tr>`
    })
    document.querySelector("tbody").innerHTML = Htmls;

}
