import { locService } from './loc.service.js'
import { storageService } from './storage.servic.js'

export const mapService = {
    initMap,
    addMarker,
    panTo
}

var gMap;
function initMap(lat = 32.0749831, lng = 34.9120554) {
    console.log('InitMap');
    return _connectGoogleApi()
        .then(() => {
            console.log('google available');
            gMap = new google.maps.Map(
                document.querySelector('#map'), {
                center: { lat, lng },
                zoom: 15
            })
            console.log('Map!', gMap);
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


function addMarker(loc) {
    var marker = new google.maps.Marker({
        position: loc,
        map: gMap,
        title: 'Hello World!'
    });
    return marker;
}


function panTo(lat, lng) {
    var laLatLng = new google.maps.LatLng(lat, lng);
    gMap.panTo(laLatLng);
}


function _connectGoogleApi() {
    if (window.google) return Promise.resolve()
    const API_KEY = 'AIzaSyCQw8nuq9TYNA8CG5A5zILLJxpSaQdlO2M'; //TODO: Enter your API Key
    var elGoogleApi = document.createElement('script');
    elGoogleApi.src = `https://maps.googleapis.com/maps/api/js?key=${API_KEY}`;
    elGoogleApi.async = true;
    document.body.append(elGoogleApi);

    return new Promise((resolve, reject) => {
        elGoogleApi.onload = resolve;
        elGoogleApi.onerror = () => reject('Google script failed to load')
    })
}