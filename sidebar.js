function showSidebar(countryName, countryCode, data) { 
    console.log(data)
    const sidebar = document.getElementById('sidebar');
    const sidebarContent = document.getElementById('sidebar-content');

    const flagUrl = `https://cdn.jsdelivr.net/gh/hampusborgos/country-flags@main/svg/${countryCode.toLowerCase()}.svg`;

    let dataContent = '<ol style="line-height: 2; padding: 35px; padding-top: 5px">';

    const labels = [];
    const values = [];


    let otherTotal = 0;

    if (Array.isArray(data) && data.length > 0) {
        for (let i = 0; i < data.length; i++) {
            dataContent += `<li>${data[i].country} exports: <span style="color: #007da3;">$${data[i].exports.toLocaleString()}</span></li>`;

            if (i < 8) {
                labels.push(data[i].country);
                values.push(Math.round(data[i].exports));
            } else if (i >= 8) {
                otherTotal += data[i].exports;
            }
            
        }
    } else {
        dataContent += '<li>No trade data available</li>';
    }
    dataContent += '</ol>';

    labels.push("Others");
    values.push(otherTotal);


    sidebarContent.innerHTML = `
    <h2>
    ${countryName}
    <img src="${flagUrl}" alt="Flag of ${countryName}" style="width: 40px; height: 20px; margin-left: 10px;">
    </h2>
    <canvas id="pieChart" style="width:auto; max-width:400px; padding-bottom: 50px"></canvas>
    <p>Partner countries ranked by total export value (USD):</p>
    ${dataContent}`;

    sidebar.classList.add('active');

    createPieChart(labels, values);
}



document.getElementById('closeBtn').addEventListener('click', function() {
    
    document.getElementById('sidebar').classList.remove('active');

});





function createPieChart(labels, values) {


    new Chart("pieChart", {
        type: 'pie',
        data: {
            labels: labels,
            datasets: [{
                backgroundColor: generateColors(values.length),
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
    const colors = [];
    for (let i = 0; i < count; i++) {
        colors.push(`hsl(${Math.floor((360 / count) * i)}, 70%, 50%)`);
    }
    return colors;
}

