function getBaseLog(x, y) {
    return Math.log(y) / Math.log(x);
  }

function drawArcs(referenceCountry, tradeResults, topPartnerValue) {

    if (map.curveLayer) {
        map.curveLayer.remove();
    }

    map.curveLayer = L.layerGroup().addTo(map);

    tradeResults.forEach(trade => {
        const destinationCountry = trade.country;
        const exportsValue = trade.exports;

        const referenceCoords = getCountryCoordinates(referenceCountry);
        const destinationCoords = getCountryCoordinates(destinationCountry);

        let weight = (exportsValue * 15) / topPartnerValue;

        if (weight > 1) {
            if (referenceCoords && destinationCoords) {

                animateCurve(referenceCoords, destinationCoords, weight);
            } else {
                console.warn(`Invalid coordinates for arc between ${referenceCountry} and ${destinationCountry}`);
            }
        }
    });

}


function createCurvePoints(referenceCoords, destinationCoords, steps = 100) {

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

function animateCurve(referenceCoords, destinationCoords, weight) {

    const curvePoints = createCurvePoints(referenceCoords, destinationCoords);
    
    const path = L.polyline(curvePoints, {
        color: '#03a9f4',
        weight: getBaseLog(1.3, weight),
        className: 'animated-curve',
        snakingSpeed: 700
    });

    if (map.curveLayer) {
        map.curveLayer.addLayer(path);
    } else {
        map.curveLayer = L.layerGroup([path]).addTo(map);
    }

    path.snakeIn();

}





function getCountryCoordinates(countryCode) {

    let countryFeature = geojsonLayer.getLayers().find(layer => layer.feature.properties.ISO_A2 === countryCode);
    
    if (countryFeature) {

        const center = countryFeature.getBounds().getCenter();
        console.log(`Coordinates for ${countryCode}: ${center.lat}, ${center.lng}`);
        return center;
    }

    console.warn(`Country coordinates not found for: ${countryCode}`);
    return null;

}