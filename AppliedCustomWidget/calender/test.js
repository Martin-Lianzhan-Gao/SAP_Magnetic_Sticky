window.onload = function(){
    window.requestAnimationFrame(getDate)
}

function getDate(){
     window.setTimeout(function(){
         window.requestAnimationFrame(getDate)
     }, 1000/2)

     var date = new Date();
     var year = date.getFullYear();
     var month = date.getMonth()+1; 
     var monthName = new Array("Jan","Feb","Mar","Apr",
     "May","Jun","Jul","Aug","Sep","Oct","Nov","Dec");
     var quarter = null;
     var second = date.getSeconds();

     if (1<=month<=3) quarter = "Q1"
     if (4<=month<=6) quarter = "Q2"
     if (7<=month<=9) quarter = "Q3"
     if (10<=month<=12) quarter = "Q4"

     var monthDisplay = document.getElementById("month");
     monthDisplay.innerHTML= monthName[month-1];
     var quarterDisplay = document.getElementById("quarter");
     quarterDisplay.innerHTML= quarter;
     var dateDisplay = document.getElementById("year");
     dateDisplay.innerHTML = year;
     var secondsDisplay = document.getElementById("seconds");
     secondsDisplay.innerHTML = second;
}