var accessToken = "pk.eyJ1IjoiZmVscHNiIiwiYSI6ImNtMHR4bW4xbTAxNnkyanM1aDFjNzVwNW4ifQ.jATKF-9ZyYdbCHEFLB5JkA";

var map = L.map('map', {attributionControl: false}).setView([0,0], 1);

var bounds = [
    [-85, -180],
    [85, 180]
]

L.tileLayer('https://api.mapbox.com/styles/v1/mapbox/dark-v10/tiles/{z}/{x}/{y}?access_token=' + accessToken, {
    attribution: '© <a href="https://www.mapbox.com/about/maps/">Mapbox</a> © <a href="https://www.openstreetmap.org/copyright">OpenStreetMap contributors</a>',
    minZoom: 3,
    maxZoom: 7,
    noWrap: false
}).addTo(map);

map.setMaxBounds(bounds);

map.on('drag', function() {
    map.panInsideBounds(bounds, {animate:false});
});


const defaultFeatureStyle = {
    weight: 0.6,
    color: '#C49BBB',
    dashArray: '3',
    fillOpacity: 0.0
};

const highlightFeatureStyle = {
    weight: 3,
    color: '#779FA1',
    dashArray: '',
    fillOpacity: 0.5
}


function style(feature) {
    return defaultFeatureStyle;
}


function highlightFeature(e) {
    var layer = e.target;
    layer.setStyle(highlightFeatureStyle);
}


function resetHighlight(e) {
    geojsonLayer.resetStyle(e.target);
}


function showSidebar(countryName, countryCode) {
    const sidebar = document.getElementById('sidebar');
    const sidebarContent = document.getElementById('sidebar-content');

    const flagUrl = `https://cdn.jsdelivr.net/gh/hampusborgos/country-flags@main/svg/${countryCode.toLowerCase()}.svg`;


    sidebarContent.innerHTML = `
    <h2>
    ${countryName}
    <img src="${flagUrl}" alt="Flag of ${countryName}" style="width: 30px; height: 20px; margin-left: 10px;">
    </h2>
    <p>This is ${countryName}. More details shall go here.</p>`;

    sidebar.classList.add('active');
}



function onEachFeature(feature, layer) {
    layer.on({
        mouseover: highlightFeature,
        mouseout: resetHighlight,
        click: function(e) {
            var featureName =  feature.properties.ADMIN || "Unknown";
            var countryCode = feature.properties.ISO_A2 || "";
            showSidebar(featureName, countryCode);
        }

    })
}


var geojsonLayer = L.geoJson(null, {
    style: style,
    onEachFeature: onEachFeature
}).addTo(map);



fetch('countries.geojson')
    .then(response => response.json())
    .then(data => {
        geojsonLayer.addData(data);
    })
    .catch(error => console.log('Error loading GeoJSON data:', error));




document.getElementById('closeBtn').addEventListener('click', function() {
    document.getElementById('sidebar').classList.remove('active');

});