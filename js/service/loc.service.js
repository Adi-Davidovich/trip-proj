console.log("hi")
export const locService = {
    getLocs,
    saveloc
}
var gIdx = 0

const locs = [
    { name: 'Greatplace', lat: 32.047104, lng: 34.832384 },
    { name: 'Neveragain', lat: 32.047201, lng: 34.832581 }
]

function getLocs() {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            resolve(locs);
        }, 2000)
    });
}


function creatNewLocation(lat, lng, id, title , weather = null, createdAt = Date.now(), updatedAt = null) {
    var loc = {
        id,
        title,
        lat,
        lng,
        weather,
        createdAt, 
        updatedAt
    }
    // TODO: save to local storage
    // locs.push(}
    return loc
}

function saveloc(lat, lng){
    var title = document.querySelector(".save-loc").value 
    creatNewLocation(lat, lng, gIdx++, title)  
}