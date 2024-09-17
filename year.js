const startYear = 1993;
const currentYear = new Date().getFullYear() - 1;
let selectedYear = currentYear;


const inputField = document.getElementById('year-display');

function updateYearDisplay() {

   inputField.value = selectedYear;

}


//USING ARROWS TO SELECT YEAR
function checkBounds(){

    if (selectedYear < startYear) {
        selectedYear = startYear;
    } else if (selectedYear > currentYear) {
        selectedYear = currentYear;
    }

}


function changeYear(direction) {

    selectedYear += direction;
    
    checkBounds();
    updateYearDisplay();

}

updateYearDisplay();


//TYPING YEAR
let previousValue = inputField.value;


inputField.onkeydown = (event) => {

  if(isNaN(event.key) && event.key !== 'Backspace') {
    event.preventDefault();
  }

};


inputField.addEventListener('focus', function() {
    previousValue = inputField.value;
});

inputField.addEventListener('blur', function() {

    if (inputField.value.length < 4) {
        inputField.value = previousValue;
    } else {
        selectedYear = parseInt(inputField.value, 10);
        checkBounds();
    }

    updateYearDisplay();

});