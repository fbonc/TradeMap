function getBaseLog(x, y) {
    return Math.log(y) / Math.log(x);
  }

function drawArcs(referenceCountry, tradeResults, topPartnerValue, mode) {

    if (map.curveLayer) {
        map.curveLayer.remove();
    }

    map.curveLayer = L.layerGroup().addTo(map);

    let countryNum = 0;

    tradeResults.forEach(trade => {
        countryNum += 1;

        const destinationCountry = trade.country;
        const exportsValue = trade.exports;

        const referenceCoords = getCountryCoordinates(referenceCountry);
        const destinationCoords = getCountryCoordinates(destinationCountry);

        let weight = (exportsValue * 15) / topPartnerValue;

        if (weight > 1 || countryNum <= 8) {
            if (referenceCoords && destinationCoords) {

                animateCurve(referenceCoords, destinationCoords, weight, mode);
            } else {
                console.warn(`Invalid coordinates for arc between ${referenceCountry} and ${destinationCountry}`);
            }
        }
    });

}


function createCurvePoints(referenceCoords, destinationCoords, mode, steps = 100) {

    if (mode === 'imports') {

        [referenceCoords, destinationCoords] = [destinationCoords, referenceCoords];
    }

    const curvePoints = [];
    const controlLat = (referenceCoords.lat + destinationCoords.lat) / 2 + 10;
    const controlLng = (referenceCoords.lng + destinationCoords.lng) / 2 + 10;

    for (let i = 0; i <= steps; i++) {
        const t = i / steps;
        const lat = (1 - t) * (1 - t) * referenceCoords.lat + 2 * (1 - t) * t * controlLat + t * t * destinationCoords.lat;
        const lng = (1 - t) * (1 - t) * referenceCoords.lng + 2 * (1 - t) * t * controlLng + t * t * destinationCoords.lng;
        curvePoints.push([lat, lng]);
    }
    return curvePoints;

}

function animateCurve(referenceCoords, destinationCoords, weight, mode) {

    const curvePoints = createCurvePoints(referenceCoords, destinationCoords, mode);

    let colour;
    if (mode === 'exports') {
        colour = '#00BFFF';
    } else {
        colour = '#C6011F';
    }
    
    const path = L.polyline(curvePoints, {
        color: `${colour}`,
        weight: getBaseLog(2, weight),
        className: 'animated-curve',
        snakingSpeed: 700,
        //dashArray: '5, 2'
    });

    if (map.curveLayer) {
        map.curveLayer.addLayer(path);
    } else {
        map.curveLayer = L.layerGroup([path]).addTo(map);
    }

    path.snakeIn();

}




let centroids = {};

fetch('centroids.geojson')
    .then(response => response.json())
    .then(data => {
        data.features.forEach(feature => {
            const countryCode = feature.properties.ISO;
            const coordinates = feature.geometry.coordinates;
            centroids[countryCode] = { lat: coordinates[1], lng: coordinates[0] }; // Store as lat/lng
        });
    })
    .catch(error => console.error('Error loading centroids data:', error));




function getCountryCoordinates(countryCode) {

    if (centroids[countryCode]) {
        const center = centroids[countryCode];
        //console.log(`Using centroid for ${countryCode}: ${center.lat}, ${center.lng}`);
        return center;
    }

    const countryFeature = geojsonLayer.getLayers().find(layer => layer.feature.properties.ISO_A2 === countryCode);

    if (countryFeature) {
        const center = countryFeature.getBounds().getCenter();
        console.log(`Using geojson layer center for ${countryCode}: ${center.lat}, ${center.lng}`);
        return center;
    }

    console.warn(`Country coordinates not found for: ${countryCode}`);
    return null;

}