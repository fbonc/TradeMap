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
}).addTo(map);

map.setMaxBounds(bounds);

map.on('drag', function() {
    map.panInsideBounds(bounds, {animate:false});
});


const defaultFeatureStyle = {
    weight: 1,             // Border weight
    color: '#779FA1',        // Border color
    dashArray: '3',        // Border dash
    fillOpacity: 0.0       // Fill opacity
};

const highlightFeatureStyle = {
    weight: 3,
    color: '#DD7596',
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


function onEachFeature(feature, layer) {
    layer.on({
        mouseover: highlightFeature,
        mouseout: resetHighlight,
        click: function(e) {
            var featureName =  feature.properties.name || "Unknown";
            layer.bindPopup("<b>" + featureName + "</b><br> You clicked this country!").openPopup();
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