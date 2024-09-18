


function showSidebar(countryName, countryCode, data) { 
    console.log(data)
    const sidebar = document.getElementById('sidebar');
    const sidebarContent = document.getElementById('sidebar-content');

    const flagUrl = `https://cdn.jsdelivr.net/gh/hampusborgos/country-flags@main/svg/${countryCode.toLowerCase()}.svg`;

    let dataContent = '<ol style="line-height: 2; padding: 35px; padding-top: 5px; font-size: 14px;">';

    const labels = [];
    const values = [];


    let otherTotal = 0;
    let dataAvailable = false;

    if (Array.isArray(data) && data.length > 0) {
        for (let i = 0; i < data.length; i++) {
            dataContent += `<li><span style="font-size: 14px">${data[i].country} exports:</span> <span style="color: #007da3; font-size: 14px;">$${data[i].exports.toLocaleString()}</span></li>`;

            if (i < 8) {
                labels.push(data[i].country);
                values.push(Math.round(data[i].exports));
            } else if (i >= 8) {
                otherTotal += data[i].exports;
            }

            dataAvailable = true;
            
        }
    } else {
        dataContent += '<span style="color: red">No trade data available at this time. Please try agian later.</span>';
        dataAvailable = false;
    }
    dataContent += '</ol>';

    labels.push("Others");
    values.push(otherTotal);


    sidebarContent.innerHTML = `
    <h2 class="country-header">
    ${countryName}
    <img src="${flagUrl}" alt="Flag of ${countryName}" style="width: 40px; height: 20px; margin-left: 10px;">
    </h2>
    <canvas id="pieChart" style="width:100%; height: 325px; padding-bottom: 50px"></canvas>
    <span style="font-size: 15px">Partner countries ranked by total export value (USD):</span>
    ${dataContent}`;

    sidebar.classList.add('active');

    if (dataAvailable) {
        createPieChart(labels, values);
    }
    
}



document.getElementById('closeBtn').addEventListener('click', function() {
    
    document.getElementById('sidebar').classList.remove('active');

});





function createPieChart(labels, values) {


    const dynamicColours = generateColors(values.length - 4)

    new Chart("pieChart", {
        type: 'pie',
        data: {
            labels: labels,
            datasets: [{
                backgroundColor: ['#ffd100', '#b5b5b5', '#a63c06', ...dynamicColours, '#343332'],
                data: values
            }]
        },
        options: {
            title: {
                display: true,
                text: 'Export Distribution'
            }
        }
    }); 
}


function generateColors(count) {
    const colors = []
    const baseHue = 220;
    const saturation = 70;

    for (let i = 0; i < count; i++) {
        const lightness = 70 - (i * (50 / count));
        colors.push(`hsl(${baseHue}, ${saturation}%, ${lightness}%)`);
    }
    return colors;
}

