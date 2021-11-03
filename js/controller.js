import { locService } from './service/loc.service.js'
import { mapService } from './service/map.service.js'
import { storageService } from './service/storage.servic.js'

window.onload = onInit;
window.onAddMarker = onAddMarker;
window.onPanTo = onPanTo;
// window.onGetLocs = onGetLocs;
window.onGetUserPos = onGetUserPos;
window.onSaveLoc = onSaveLoc
window.onDeleteLoc = onDeleteLoc

function onInit() {
    mapService.initMap()
        .then(() => {
            console.log('Map is ready');
            onRenderLoc()
        })
        .catch(() => console.log('Error: cannot init map'));
}

// This function provides a Promise API to the callback-based-api of getCurrentPosition
function getPosition() {
    console.log('Getting Pos');
    return new Promise((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject)
    })
}

function onAddMarker() {
    console.log('Adding a marker');
    mapService.addMarker({ lat: 32.0749831, lng: 34.9120554 });
}

// function onGetLocs() {
//     locService.getLocs()
//         .then(locs => {
//             console.log('Locations:', locs)
//             document.querySelector('.locs').innerText = JSON.stringify(locs)
//         })
// }

function onGetUserPos() {
    getPosition()
        .then(pos => {
            console.log('User position is:', pos.coords);
            document.querySelector('.user-pos').innerText =
                `Latitude: ${pos.coords.latitude} - Longitude: ${pos.coords.longitude}`
        })
        .catch(err => {
            console.log('err!!!', err);
        })
}
function onPanTo(lat, lng) {
    console.log('Panning the Map');
    mapService.panTo(lat, lng);
}

function onSaveLoc(lat, lng) {
    locService.saveloc(lat, lng)
    onRenderLoc()
}

function onRenderLoc() {
    locService.getLocs().then(locs => {
        if (!locs) return;
        renderLoc(locs)});
}

function renderLoc(locs){
    var HtmlTable = `<table><thead><th>Title</th><th>Location</th><th></th><th></th></thead><tbody>`
    var Htmls = locs.map(loc => {
        return `<tr>
            <td>${loc.title}</td>
            <td>${loc.lat, loc.lng}</td>
            <td><button onClick="onPanTo(${loc.lat}, ${loc.lng})">go</button></td>
            <td><button onclick="onDeleteLoc((${loc.id}))">delete</button></td>
            </tr>`
    })
    var HtmlTable1 = `</tbody></table>`
    document.querySelector(".table-container").innerHTML = HtmlTable + Htmls.join('') + HtmlTable1;
}

function onDeleteLoc(locId) {
    locService.deleteLoc(locId)
    onRenderLoc()
}