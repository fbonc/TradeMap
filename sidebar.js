


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



document.getElementById('closeBtn').addEventListener('click', function() {
    
    document.getElementById('sidebar').classList.remove('active');

});