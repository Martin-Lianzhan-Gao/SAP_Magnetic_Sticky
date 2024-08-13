(function(){
    let template = document.createElement("template"); 
    template.innerHTML = `
        <div class="calenderBody" id="calenderBody">
            <div class = "date" id="month">
            </div>
            <div class = "date" id="quarter">
            </div>
            <div class = "date" id="year">
            </div>
            <button id="switch">  
            </button>    
        </div>
        <style>
             @import url('https://fonts.googleapis.com/css2?family=Roboto:wght@400;700&display=swap');

            .calenderBody {
                border-radius: 8px;
                height: 90%;
                width: 90%;
                margin: 5%;
                background-color: #26a69a;
                box-shadow: 0 3px 6px rgba(0,0,0,0.16), 0 3px 6px rgba(0,0,0,0.23);
                position: relative;
                z-index: 1;           
            }

            .calenderBody:before{
                content: "";
                position:absolute;
                top: 0;
                border-radius: 8px;
                bottom: 0;
                left: 0;
                right: 0;
                background-color: #ff867c;
                transition: transform 300ms ease-in-out;    
                transform: scaleY(0);
                transform-origin: top;
                z-index: -1;
            }

            #calenderBody.cover{
                content: "";
                position:absolute;
                top: 0;
                border-radius: 8px;
                bottom: 0;
                left: 0;
                right: 0;
                background-color: #ff867c;
                transition: transform 300ms ease-in-out;    
                transform: scaleY(1);
                transform-origin: top;
                // z-index: -1;
            }

            .date{
                width: 30%;
                font-family: 'Roboto', sans-serif;
                position: relative;
                color: #eeeeee;
                transition: 0.3s;
                z-index: 3;
            }

            .date.rotated{
                color:black;
                transform:rotateY(360deg);
            }

            #month {
                height: 20%;
                font-size: 25px;
                font-weight: 700;
                padding: 10%;
            }
            
            #quarter{
                height: 15%;
                font-size: 20px;
                font-weight: 700;
                left: 10%;
            }
            
            #year{
                height: 15%;
                font-size: 20px;
                margin: 10%;
            }

            #switch{
                z-index: 4;
                // margin-bottom: 50%;
                margin-top: -50%;
                margin-left: 65%;
                border-radius: 20px;
                width: 30%;
                height: 30%;
                transition: 0.3s;
                text-align: center;
                background: url("http://localhost:3000/AppliedCustomWidget/calender/images/upwards_white.png") no-repeat;
                background-position: center;
                border-style: none;
                display: inline-block;
                position: absolute;
            }

            #switch:hover {
                background-color: black;
                opacity: 0.6;
            }

            #switch.clicked{
                transform: rotateX(360deg);
            }

        </style>
    `;

    class Calender extends HTMLElement {
        
        constructor() {
            // must call super first
            super();
            let shadowRoot = this.attachShadow({mode: "open"});
            // hint: you can also define css style here 
			shadowRoot.appendChild(template.content.cloneNode(true));
            // define properties
            this.status = true;
            this._date = "null";
            this.monthDisplay = this.shadowRoot.getElementById("month");
            this.quarterDisplay = this.shadowRoot.getElementById("quarter");
            this.yearDisplay = this.shadowRoot.getElementById("year");
            // load time
            this._getTime(this.status);
            // define the click event 
            this.shadowRoot.getElementById("switch").onclick = e => { 
                if (this.status === true){
                    this.status = false;
                } else if (this.status === false){
                    this.status = true;
                }
                // update date and icon
                this._getTime(this.status);
                this._updateWidget(this.status);
                // run cover effect
                // date rotate effect
                this.shadowRoot.getElementById("month").classList.toggle('rotated');
                this.shadowRoot.getElementById("quarter").classList.toggle('rotated');
                this.shadowRoot.getElementById("year").classList.toggle('rotated');
                // background cover effect
                this.shadowRoot.getElementById("calenderBody").classList.toggle('cover');
                // other effect
                this.shadowRoot.getElementById("switch").classList.toggle("clicked");
                // test date
                // console.log(this._date);
            };      
        }
        
        /**
         * change the date depends on the system, if true then current date, false then the date of last month
         * @param {*} status 
         * @returns ""
         */
        _getTime(status){
            var date = new Date();
            var year = date.getFullYear();
            var month = null;
            if (status === true){
                month = date.getMonth()+1; 
            }
            if (status === false){
                month = date.getMonth();
            }
            var monthName = new Array("Jan","Feb","Mar","Apr",
            "May","Jun","Jul","Aug","Sep","Oct","Nov","Dec");
            var quarter = null;
            
            if (1<=month<=3) quarter = "Q1"
            if (4<=month<=6) quarter = "Q2"
            if (7<=month<=9) quarter = "Q3"
            if (10<=month<=12) quarter = "Q4"
   
            this.monthDisplay.innerHTML= monthName[month-1];
            this.quarterDisplay.innerHTML= quarter;
            this.yearDisplay.innerHTML = year;
            this._date = year + ""+ month;
            return "";
        }

        /**
         * change the switch icon depends on the current status
         * @param {*} status 
         */
        _updateWidget(status){
            var switchBtn = this.shadowRoot.getElementById("switch");
            if (this.status === true){
                switchBtn.style.backgroundImage = "url(http://localhost:3000/AppliedCustomWidget/calender/images/upwards_white.png)";
            }
            if (this.status === false){
                switchBtn.style.backgroundImage = "url(http://localhost:3000/AppliedCustomWidget/calender/images/downwards.png)";
            }
        }

        getDate(){
            return this._date;
        }

        set date(newDate){
            this._date = newDate;
        }
    }
    customElements.define("com-sap-martinscalenderwidget", Calender);
}
)();