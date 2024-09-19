

let validCountryCodes = [];

function loadCountryCodes() {
    return fetch('codes.json')
        .then(response => {
            if (!response.ok) {
                throw new Error('Failed to load country codes');
            }
            return response.json();
        })
        .then(data => {
            validCountryCodes = data.Code.map(code => code['@value']);
        })
        .catch(error => console.error('Error loading country codes:', error));
}


function getTradeData(countryCodeA2, year, mode) {

    const apiUrl = `https://trademap-backend.vercel.app/api/trade?countryCodeA2=${countryCodeA2}&year=${year}&mode=${mode}`;

    let loaderTimeout = setTimeout(() => {
        document.getElementById('loader').style.display = 'block';
    }, 500);

    return fetch(apiUrl)
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            return processTradeData(data);
        }).finally(() => {
            clearTimeout(loaderTimeout);
            document.getElementById('loader').style.display = 'none';
        });
        
}

function processTradeData(data) {
    const seriesData = data.CompactData.DataSet.Series;
    
    const tradeResults = [];

    seriesData.forEach(series => {
        const counterpartArea = series['@COUNTERPART_AREA'];
        
        if (validCountryCodes.includes(counterpartArea)) {
            if (series.Obs && series.Obs['@OBS_VALUE']) {
                const obsValue = series.Obs['@OBS_VALUE'];
                
                tradeResults.push({
                    country: counterpartArea,
                    exports: obsValue * Math.pow(10, 6) //convert @OBS_VALUE to actual value (* 10^6)
                });
            } else {
                //console.warn(`No valid Obs data for country: ${counterpartArea}`);
                
            }
        } else {
            //console.warn(`Country code ${counterpartArea} not in codes.json`);
        }
    });

    tradeResults.sort((a, b) => b.exports - a.exports);
    //console.log(tradeResults);
    return tradeResults;
}


