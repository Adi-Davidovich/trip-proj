import { locService } from './service/loc.service.js'
import { mapService } from './service/map.service.js'


window.onload = onInit;
window.onGetUserPos = onGetUserPos;
window.onSaveLoc = onSaveLoc;
window.onDeleteLoc = onDeleteLoc;
window.onGoTo = onGoTo;
window.onPanTo = onPanTo;
window.onSearchLocation = onSearchLocation;

function onInit() {
    mapService.initMap()
        .then(() => {
            _renderLoc()
        })
        .catch(() => console.log('Error: cannot init map'));
}

// This function provides a Promise API to the callback-based-api of getCurrentPosition
function getPosition() {
    return new Promise((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject);
    })
}


function onGetUserPos() {
    getPosition()
        .then(pos => {
            document.querySelector('.my-location').hidden = false;
            locService.connectReverseGoogleGeocodeApi(pos.coords.latitude, pos.coords.longitude)
            .then(locationAddress => document.querySelector('.user-pos').innerText = locationAddress)
            mapService.panTo(pos.coords.latitude, pos.coords.longitude);
            const myPos = { lat: pos.coords.latitude, lng: pos.coords.longitude };
            mapService.addMarker(myPos, 'My location');
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
    _renderLoc()
}


function _renderLoc() {
    const elLocs = document.querySelector(".locs");
    locService.getLocs().then(locs => {
        if (!locs || !locs.length) elLocs.innerHTML = 'No saved locations <div>To save a location click the desired location on the map</div>'
        else {
            var HtmlTable = `<table><thead><th>Title</th><th>Location</th><th></th><th></th></thead><tbody>`
            var Htmls = locs.map(loc => {
                locService.connectReverseGoogleGeocodeApi(loc.lat, loc.lng)
                .then(locationAddress => document.querySelector(`.${loc.id}`).innerText = locationAddress)
                return `<tr>
                            <td>${loc.title}</td>
                            <td class="${loc.id}"></td>
                            <td><button onClick="onGoTo(${loc.lat}, ${loc.lng}, '${loc.title}')">go</button></td>
                            <td><button onclick="onDeleteLoc('${loc.id}', '${loc.title}')">delete</button></td>
                        </tr>`
            })
            var HtmlTable1 = `</tbody></table>`
            elLocs.innerHTML = HtmlTable + Htmls.join('') + HtmlTable1;
        }
    });
}


function onDeleteLoc(locId, locTitle) {
    locService.deleteLoc(locId)
    mapService.deleteMarker(locTitle)
    _renderLoc()
}


function onGoTo(lat, lng, title) {
    mapService.panTo(lat, lng);
    const pos = { lat: lat, lng: lng };
    mapService.addMarker(pos, title);
}


function onSearchLocation() {
    const searchValue = document.querySelector('.search').value
    locService.searchLocation(searchValue)
    _renderLoc()
}
