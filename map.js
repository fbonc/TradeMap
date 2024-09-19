var accessToken = "pk.eyJ1IjoiZmVscHNiIiwiYSI6ImNtMHR4bW4xbTAxNnkyanM1aDFjNzVwNW4ifQ.jATKF-9ZyYdbCHEFLB5JkA";

var map = L.map('map', {attributionControl: false,
                        zoomControl: true
                        }).setView([0,0], 1);

                        map.zoomControl.setPosition('bottomleft');


var bounds = [
    [-85, -180],
    [85, 180]
]

L.tileLayer('https://api.mapbox.com/styles/v1/mapbox/dark-v10/tiles/{z}/{x}/{y}?access_token=' + accessToken, {

    attribution: '© <a href="https://www.mapbox.com/about/maps/">Mapbox</a> © <a href="https://www.openstreetmap.org/copyright">OpenStreetMap contributors</a>',
    minZoom: 2,
    maxZoom: 7,
    noWrap: false,
    tileSize: 512,
    zoomOffset: -1,

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



var geojsonLayer = L.geoJson(null, {

    style: style,
    onEachFeature: onEachFeature

}).addTo(map);



fetch('countries.geojson')
    .then(response => response.json())
    .then(data => {
        const filteredData = data.features.filter(feature => 
            feature.properties.ADMIN !== "Antarctica" 

            && feature.properties.ADMIN !== "Macao S.A.R"

            && feature.properties.ADMIN !== "Saint Barthelemy" && feature.properties.ADMIN !== "Saint Martin" && feature.properties.ADMIN !== "Saint Pierre and Miquelon"
            && feature.properties.ADMIN !== "Wallis and Futuna" && feature.properties.ADMIN !== "Clipperton Island" && feature.properties.ADMIN !== "French Southern and Antarctic Lands"

            && feature.properties.ADMIN !== "Akrotiri Sovereign Base Area" && feature.properties.ADMIN !== "Dhekelia Sovereign Base Area" && feature.properties.ADMIN !== "British Indian Ocean Territory"
            && feature.properties.ADMIN !== "British Virgin Islands" && feature.properties.ADMIN !== "Cayman Islands" && feature.properties.ADMIN !== "Pitcairn Islands"
            && feature.properties.ADMIN !== "Saint Helena" && feature.properties.ADMIN !== "South Georgia and South Sandwich Islands" && feature.properties.ADMIN !== "Turks and Caicos Islands"

            && feature.properties.ADMIN !== "United States Virgin Islands" && feature.properties.ADMIN !== "Northern Mariana Islands"

            && feature.properties.ADMIN !== "Northern Cyprus"

            && feature.properties.ADMIN !== "Western Sahara"

            && feature.properties.ADMIN !== "Somaliland"
        );

        geojsonLayer.addData(filteredData);
    })
    
    .catch(error => console.log('Error loading GeoJSON data:', error));



const toggleSwitch = document.querySelector('#button-3 .checkbox');
function getToggleContent() {
    return toggleSwitch.checked ? 'imports' : 'exports';
}

function onEachFeature(feature, layer) {

    layer.on({

        mouseover: highlightFeature,
        mouseout: resetHighlight,

        click: function(e) {

            var featureName =  feature.properties.ADMIN || "Unknown";
            var countryCodeA2 = feature.properties.ISO_A2 || "";
            var year = document.getElementById('year-display').value;
            const mode = getToggleContent();
            
            console.log(featureName);

            loadCountryCodes().then(() => { 

                getTradeData(countryCodeA2, year, mode).then(data => {

                    showSidebar(featureName, countryCodeA2, data, mode);
                    drawArcs(countryCodeA2, data, data[0].exports, mode);

                }).catch(error => {

                    console.error('Error fetching trade data:', error);
                    showSidebar(featureName, countryCodeA2, []);
                    
                });

            });
        }

    })

}