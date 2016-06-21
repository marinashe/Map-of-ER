var myIcon = L.icon({
    // iconUrl: 'https://d30y9cdsu7xlg0.cloudfront.net/png/12314-200.png',
    iconUrl: 'http://ih1.redbubble.net/image.5551197.0068/sticker,375x360.png',


    iconSize: [40, 40]

});

//L.marker([50.505, 30.57], {icon: myIcon}).addTo(map);

var keys = Object.keys(rooms);
//
 class Point {
     constructor(x, y) {
         this.x = x;
         this.y = y;
     }
 }
//
// class Room extends Point {
//     constructor(x, y, name, company, people, link) {
//         super(x, y);
//         this.name = name;
//         this.company = company;
//         this.people = people;
//         this.link = link;
//     }
// }
//
// var all_rooms = Array.from(Object.entries(rooms)).filter(([k, room]) => k != '121').map(([k, room]) => room);
var all_rooms = [];

// for (var [k, room] of Object.entries(rooms)) {
//     if (k !== '121') {
//         all_rooms.push(room);
//     }
// }
for (var k of keys) {
    if (k !== '121') {
        // all_rooms.push(new Room(rooms[k]['x'], rooms[k]['y'], rooms[k]['name'], rooms[k]['company'], rooms[k]['people'], rooms[k]['link']));
        all_rooms.push(rooms[k]);
    }
}

var rooms_info = all_rooms.reduce(function(acc, item) {
    var key = [item.x, item.y];
    acc[key] = acc[key] || [];
    acc[key].push(item);
    return acc;
}, {});

var places = Object.keys(rooms_info);

var options = {
    enableHighAccuracy: true,
    timeout: 5000,
    maximumAge: 0
};

function success(pos) {
    var crd = pos.coords;

    var mymap = L.map('mapid', {
        'center': [crd.latitude, crd.longitude],
        'zoom': 10
    });

    L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}', {
        attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="http://mapbox.com">Mapbox</a>',
        maxZoom: 18,
        id: 'myfairytale.0d7ehf1o',
        accessToken: 'pk.eyJ1IjoibXlmYWlyeXRhbGUiLCJhIjoiY2lwZjd5bTJwMDAwcHVrbmhkNTNlNDduZSJ9.25N4uvN-H4exkNSyyepOKQ'
    }).addTo(mymap);


    for (let place of places) {
        var marker_d = L.marker([rooms_info[place][0].x, rooms_info[place][0].y]).addTo(mymap);
        var text = '';
        for (let r of rooms_info[place]) {

            text += '<b>' + r.name + '</b><br>Company: ' + r.company + '<br>People: ' + r.people + '<br>' + '<a href=' + r.link + '>Book</a><br>';

        }
        marker_d.bindPopup(text).openPopup();
    }
    var marker = L.marker([crd.latitude, crd.longitude], {icon: myIcon, zIndexOffset: -10}).addTo(mymap);
     marker.bindPopup("You are here!").openPopup();
}

function error(err) {
    console.warn('ERROR(' + err.code + '): ' + err.message);
}

navigator.geolocation.getCurrentPosition(success, error, options);
