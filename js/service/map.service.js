import { locService } from './loc.service.js'
import { storageService } from './storage.servic.js'

export const mapService = {
    initMap,
    addMarker,
    panTo,
    deleteMarker
}

let gMap;
let markers = [];

function initMap(lat = 32.0749831, lng = 34.9120554) {
    return _connectGoogleApi()
        .then(() => {
            gMap = new google.maps.Map(
                document.querySelector('#map'), {
                center: { lat, lng },
                zoom: 15
            })
            let infoWindow = new google.maps.InfoWindow({
                content: "Click the map to save location!",
                position: { lat, lng },
              });
            
              infoWindow.open(gMap);
              // Configure the click listener.
              gMap.addListener("click", (mapsMouseEvent) => {
                // Close the current InfoWindow.
                infoWindow.close();
                // Create a new InfoWindow.
                infoWindow = new google.maps.InfoWindow({
                  position: mapsMouseEvent.latLng,
                });
        
                // extract the lat and lng from the map event
                const {lat , lng} = mapsMouseEvent.latLng.toJSON()
                infoWindow.setContent(
                    `<input type="text" placeholder="enter title" class="save-loc">
                    <h4>save?</h4>
                    <button onclick="onSaveLoc(${lat}, ${lng})">save place</button>`
                );
                infoWindow.open(gMap);
              });
              
        })
        
}


function addMarker(loc, title) {
    var marker = new google.maps.Marker({
        position: loc,
        map: gMap,
        title
    });
    markers.push(marker);
    return marker;
}

function deleteMarker(title){
    if (!markers || markers.length === 0) return
    else{
        const i = markers.findIndex(marker => {
            return marker.title === title
        })
        markers[i].setMap(null)
        markers.splice(i,1)
    }
}


function panTo(lat, lng) {
    var laLatLng = new google.maps.LatLng(lat, lng);
    gMap.panTo(laLatLng);
}


function _connectGoogleApi() {
    if (window.google) return Promise.resolve()
    const API_KEY = 'AIzaSyCQw8nuq9TYNA8CG5A5zILLJxpSaQdlO2M';
    var elGoogleApi = document.createElement('script');
    elGoogleApi.src = `https://maps.googleapis.com/maps/api/js?key=${API_KEY}`;
    elGoogleApi.async = true;
    document.body.append(elGoogleApi);

    return new Promise((resolve, reject) => {
        elGoogleApi.onload = resolve;
        elGoogleApi.onerror = () => reject('Google script failed to load')
    })
}