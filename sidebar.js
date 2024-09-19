window.onload = function() {
    loadCountryNames();
};

let countryNamesMap = {};

function loadCountryNames() {

    return fetch('codes.json')
        .then(response => response.json())
        .then(data => {
            data.Code.forEach(country => {
                countryNamesMap[country['@value']] = country.Description['#text'];
            });
        })
        .catch(error => console.error('Error loading country names:', error));

}

// const colours = ['#ffd100', '#c3dfe3', '#a63c06', "hsl(220, 70%, 80%)", "hsl(220, 70%, 70%)","hsl(220, 70%, 60%)","hsl(220, 70%, 50%)","hsl(220, 70%, 40%)", '#343332'];

function showSidebar(countryName, countryCode, data, mode) { 
    console.log(data)
    const sidebar = document.getElementById('sidebar');
    const sidebarContent = document.getElementById('sidebar-content');
    const flagUrl = `https://cdn.jsdelivr.net/gh/hampusborgos/country-flags@main/svg/${countryCode.toLowerCase()}.svg`;


    let colours = [];

    if (mode == 'exports') {
        colours = ['#008585', '#43b0f1', '#8a508f', '#bc5090', '#ff6361', '#ff8531', '#ffa600', '#ffd380', '#343332'];
    } else if (mode == 'imports') {
        colours = ['#ff595e', '#ff924c', '#ffca3a', '#8ac926', '#52a675', '#1982c4', '#4267ac', '#6a4c93', '#343332'];
    }




    let dataContent = '<ol style="line-height: 2; padding-left: 20px; padding-top: 5px; font-size: 14px;">';

    const labels = [];
    const values = [];

    let total = 0;
    let otherTotal = 0;
    let dataAvailable = false;
    let colour;

    if (Array.isArray(data) && data.length > 0) {
        for (let i = 0; i < data.length; i++) {
            dataAvailable = true;
            colour = '#b5b1ae';

            const fullCountryName = countryNamesMap[data[i].country] || data[i].country;

            if (i < 8) {
                labels.push(data[i].country);
                values.push(Math.round(data[i].exports));
                total += Math.round(data[i].exports);
                colour = colours[i];
            } else if (i >= 8) {
                otherTotal += Math.round(data[i].exports);
                total += Math.round(data[i].exports);
            }

            dataContent += `<li style="white-space: nowrap; overflow: visible"><span style="font-size: 14px">${fullCountryName} (${data[i].country}):</span> <span style="color: ${colour}; font-size: 14px;">$${data[i].exports.toLocaleString()}</span></li>`;

        }
    } else {
        dataContent += '<span style="color: red">No trade data available at this time. Please try again later.</span>';
        dataAvailable = false;
    }
    dataContent += '</ol>';

    labels.push("Others");
    values.push(otherTotal);



    slicedMode = mode.slice(0, -1);

    sidebarContent.innerHTML = `
    <div class="country-header-container">
    <h2 class="country-header">
    ${countryName}
    <img src="${flagUrl}" alt="Flag of ${countryName}" style="width: 40px; height: 20px; margin-left: 0px;">
    </h2>
    </div>
    <canvas id="pieChart" style="width:100%; height: 325px; padding-bottom: 50px"></canvas>
    <hr style="margin-top: -20px; margin-bottom: 20px">
    <span style="font-size: 13px; font-weight: 700;">Total ${mode}:</span> <span style="font-size: 14px;">$${total.toLocaleString()}</span><br>
    <span style="font-size: 13px; font-weight: 700;">Partner countries ranked by total ${slicedMode} value:</span>
    ${dataContent}`;

    sidebar.classList.add('active');



    if (dataAvailable) {
        createPieChart(labels, values, slicedMode, colours);
    }
    
}



document.getElementById('closeBtn').addEventListener('click', function() {
    
    document.getElementById('sidebar').classList.remove('active');

});





function createPieChart(labels, values, mode, colours) {

    new Chart("pieChart", {
        type: 'doughnut',
        data: {
            labels: labels,
            datasets: [{
                backgroundColor: colours,
                data: values,
                borderWidth: 0,
            }]
        },
        options: {
            title: {
                display: true,
                text: `${mode.charAt(0).toUpperCase() + mode.slice(1)} Distribution`,
                padding: 26,
                fontSize: 20,
                fontWeight: 10,
                fontStyle: "normal",
                fontColor: '#ffffff',
            },
            legend: {
                display: false,
            }

        }
    }); 
}

