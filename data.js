function getTradeData(countryCodeA2, year) {

    const apiUrl = `https://trademap-backend.vercel.app/api/trade?countryCodeA2=${countryCodeA2}&year=${year}`;

    fetch(apiUrl)
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            processTradeData(data);
        })
        .catch(error => console.error('Error fetching trade data:', error));

}

function processTradeData(data) {

    const seriesData = data.CompactData.DataSet.Series;
    
    const tradeResults = [];

    seriesData.forEach(series => {
        const counterpartArea = series['@COUNTERPART_AREA'];
        
        //check if Obs is defined and has @OBS_VALUE
        if (series.Obs && series.Obs['@OBS_VALUE']) {
            const obsValue = series.Obs['@OBS_VALUE'];
            
            tradeResults.push({
                country: counterpartArea,
                exports: obsValue * Math.pow(10, 6) //convert @OBS_VALUE to actual value (* 10^6)
            });
        } else {
            console.warn(`No valid Obs data for country: ${counterpartArea}`);
        }
    });

    tradeResults.sort((a, b) => b.exports - a.exports);
    // Log or use the tradeResults as needed
    console.log(tradeResults);
    
}