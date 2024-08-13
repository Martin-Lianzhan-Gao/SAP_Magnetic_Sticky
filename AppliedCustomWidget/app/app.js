var timer = 0;
(function(){

    class App extends HTMLElement {
        constructor(){
            super();
            let shadowRoot = this.attachShadow({mode: "open"});
            let template = document.createElement("template");
            template.innerHTML = `
                <div id="head_part" class="wrapper">
                    <nav class="top_nav" id="nav_1">
                        <input type="radio" name="option_cover" id="this_mon" checked>
                        <input type="radio" name="option_cover" id="last_mon">
                        <label for="this_mon" class="this_mon"><div>This Month</div></label>
                        <label for="last_mon" class="last_mon"><div>Last Month</div></label>
                        <div class="option_cover"></div>
                    </nav>
                    <nav class="top_nav" id="nav_2">
                        <input type="radio" name="option_bar" id="deal_sup" checked>
                        <input type="radio" name="option_bar" id="enable">
                        <input type="radio" name="option_bar" id="proj_sup">
                        <label for="deal_sup" class="deal_sup"><div>DEALSUPPORT</div></label>
                        <label for="enable" class="enable"><div>ENABLEMENT</div></label>
                        <label for="proj_sup" class="proj_sup"><div>PROJSUPPORT</div></label>
                        <div class="option_bar"></div>
                    </nav>
                </div>
                <div id="table_body">
                    <table class="interactive_table" id="deal_table">
                        <tr>
                            <th>Customer</th>
                            <th class="count">Count</th>
                            <th class="man_hour">Man Hour</th>
                            <th class="audience">Audience</th>
                        </tr>
                    </table>
                    <table class="interactive_table" id="enable_table">
                        <tr>
                            <th>Customer</th>
                            <th class="count">Count</th>
                            <th class="man_hour">Man Hour</th>
                            <th class="audience">Audience</th>
                        </tr>
                    </table>
                    <table class="interactive_table" id="proj_table">
                        <tr>
                            <th>Customer</th>
                            <th class="count">Count</th>
                            <th class="man_hour">Man Hour</th>
                            <th class="audience">Audience</th>
                        </tr>
                    </table>
                </div>
                <button type="button" id="new_record_btn">Add</button>
                <div id="new_record_page">
                    <nav class="new_record_nav" id="nav_month">
                        <input type="radio" name="opt_cover1" id="opt_this_mon" checked>
                        <input type="radio" name="opt_cover1" id="opt_last_mon">
                        <label for="opt_this_mon" class="opt_this_mon"><div>This Month</div></label>
                        <label for="opt_last_mon" class="opt_last_mon"><div>Last Month</div></label>
                        <div class="opt_cover1"></div>
                    </nav>
                    <nav class="new_record_nav" id="nav_type">
                        <input type="radio" name="opt_cover2" id="opt_deal_sup" checked>
                        <input type="radio" name="opt_cover2" id="opt_enable">
                        <input type="radio" name="opt_cover2" id="opt_proj_sup">
                        <label for="opt_deal_sup" class="opt_deal_sup"><div>DEALSUPPORT</div></label>
                        <label for="opt_enable" class="opt_enable"><div>ENABLEMENT</div></label>
                        <label for="opt_proj_sup" class="opt_proj_sup"><div>PROJSUPPORT</div></label>
                        <div class="opt_cover2"></div>
                    </nav>
                    <div id="customer_label" class="general_input_label">
                    <div>
                        Customer Name
                    </div>
                    </div>
                    <input type="text" id="customer_input" class="general_value_input"></input>
                    <button type="button" id="fillin_btn">Next</button>
                    <div id="input_overlay" class="recommend_content">
                    </div>
                </div>
               
                <style>
                    @import "http://localhost:3000/AppliedCustomWidget/app/app.css"
                </style>
            `;
            
           
            // template.appendChild(jquery);
            shadowRoot.appendChild(template.content.cloneNode(true));

            this.thisMon = "202105";
            this.lastMon = "202104";

            this.existingRecord = null;
            
            // table effect definition when switch check target on secondary navigation
            var dealSupOpt = this.shadowRoot.getElementById("deal_sup");
            var enableOpt = this.shadowRoot.getElementById("enable");
            var projSupOpt = this.shadowRoot.getElementById("proj_sup");

            this.dealSupTable = this.shadowRoot.getElementById("deal_table");
            this.enableTable = this.shadowRoot.getElementById("enable_table");
            this.projSupTable = this.shadowRoot.getElementById("proj_table");

            this.thisMonthOpt = this.shadowRoot.getElementById("this_mon");
            this.lastMonthOpt = this.shadowRoot.getElementById("last_mon");
            
            this.thisMonthOpt.onclick = e =>{
                this.deployData(this.dealSupSetCurrent, this.dealSupTable, "Deal Support");
                this.deployData(this.enableSetCurrent,this.enableTable,"Enablement");
                this.deployData(this.projSupSetCurrent,this.projSupTable,"Project Support");
            }

            this.lastMonthOpt.onclick = e =>{
                this.deployData(this.dealSupSetLast, this.dealSupTable, "Deal Support");
                this.deployData(this.enableSetLast,this.enableTable,"Enablement");
                this.deployData(this.projSupSetLast,this.projSupTable,"Project Support");
            }

            // originally displays deal support table
            if (dealSupOpt.checked){
                // only deal_table will be moved and displayed in the middle
                this.dealSupTable.style.left = "0%";
                // dealSupTable.style.top = "0%";
                // other tables will be moved into left side of window
                this.enableTable.style.left = "100%";
                this.projSupTable.style.left = "100%";
            }

            dealSupOpt.onclick = e =>{
                if (dealSupOpt.checked){
                    // only deal_table will be moved and displayed in the middle
                    this.dealSupTable.style.left = "0%";
                    // dealSupTable.style.top = "0%";
                    // other tables will be moved into left side of window
                    this.enableTable.style.left = "100%";
                    this.projSupTable.style.left = "100%";
                }
            }

            enableOpt.onclick = e => {
                if (enableOpt.checked){
                    // only enable_table will be moved and displayed in the middle
                    this.enableTable.style.left = "0%";
                    // enableTable.style.top = "0%";
                    // deal_table will be moved into right side of window
                    this.dealSupTable.style.left = "-100%";
                    // proj_table will be moved into left side of window
                    this.projSupTable.style.left = "100%";
                }
            }

            projSupOpt.onclick = e =>{
                if (projSupOpt.checked){
                    // only proj_table will be moved and displayed in the middle
                    this.projSupTable.style.left = "0%";
                    // projSupTable.style.top = "0%";
                    // other tables will be moved into right side of window
                    this.dealSupTable.style.left = "-100%";
                    this.enableTable.style.left = "-100%";
                }
            }

            // data processing variables and techniques
            this.dealSupSetCurrent = new Array();
            this.enableSetCurrent = new Array();
            this.projSupSetCurrent = new Array();
            this.dealSupSetLast = new Array();
            this.enableSetLast = new Array();
            this.projSupSetLast = new Array();

            // events for table pop up input form
            this.newRecordBtn = this.shadowRoot.getElementById("new_record_btn");
            this.tableBody = this.shadowRoot.getElementById("table_body");

            this.shadowRoot.getElementById("head_part").onclick = e =>{
                if(this.shadowRoot.getElementById("table_pop_up")!= null){
                    this.tableBody.removeChild(this.shadowRoot.getElementById("table_pop_up"));
                    this.newRecordBtn.style.bottom = "3%";
                }
            }

            // events for new record page
            this.newRecordPage = this.shadowRoot.getElementById("new_record_page");
            this.newRecordBtn.onclick = e =>{
                 this.newRecordBtnOpenAndCloseManipulationWidgetEvent();
            } 

            // name deploy and input recommendation
            this.names = new Array();
            // stores all names and it's lower case form as key-value
            this.fillInBtn = this.shadowRoot.getElementById("fillin_btn");

            this.customerInput = this.shadowRoot.getElementById("customer_input");
            this.inputOverlay = this.shadowRoot.getElementById("input_overlay");
            this.customerInput.onchange = e =>{
                this.inputFormEvents();
            }
            this.customerInput.oninput = e =>{
                this.inputFormEvents();
            }

            this.fillInBtn.onclick = e =>{
                this.fillInBtnEvents();
            }

            

            // new record events bind
            this.dealSupFilter = this.shadowRoot.getElementById("opt_deal_sup");
            this.enableOptFilter = this.shadowRoot.getElementById("opt_enable");
            this.projSupFilter = this.shadowRoot.getElementById("opt_proj_sup");
            this.thisMonthFilter = this.shadowRoot.getElementById("opt_this_mon");
            this.lastMonthFilter = this.shadowRoot.getElementById("opt_last_mon");

            this.typeFilter = "";
            this.monthFilter = "";

            if(this.dealSupFilter.checked){
                this.typeFilter = "Deal Support";
            }

            if(this.thisMonthFilter.checked){
                this.monthFilter = this.thisMon;
            }

            this.dealSupFilter.onclick = e =>{
                if(this.dealSupFilter.checked){
                    this.typeFilter = "Deal Support";
                }
            }

            this.enableOptFilter.onclick = e =>{
                if(this.enableOptFilter.checked){
                    this.typeFilter = "Enablement";
                }
            }

            this.projSupFilter.onclick = e =>{
                if(this.projSupFilter.checked){
                    this.typeFilter = "Project Support";
                }
            }

            this.thisMonthFilter.onclick = e =>{
                if(this.thisMonthFilter.checked){
                    this.monthFilter = this.thisMon;
                }
            }

            this.lastMonthFilter.onclick = e =>{
                if(this.lastMonthFilter.checked){
                    this.monthFilter = this.lastMon;
                }
            }

            
        }

        /***
         * load datas of data source of a table in app design and stores them into interactive
         * tables based on type. 
         * Detailed:
         * 1. Deal Support -> customer count manhour
         * 2. Enablement -> customer count audience
         * 3. Project Support -> customer manhour
         * @param {Array<{"@MeasureDimension":{id:string, description:string, parentId:string, rawValue:string, formattedValue:string}
         * ,Customer:{id:string, description:string, parentId:string, properties:{}}
         * ,Date:{id:string, description:string, parentId:string, properties:{}}
         * ,Type:{id:string, description:string, parentId:string, properties:{}}
         * ,User:{id:string, description:string, parentId:string, properties:{}}}>} data
         * @param {HTMLElement} table
         * @param {string} type
         */
         deployData(data,table,type){

            var root = this.shadowRoot;
            var tableBody = this.tableBody;
            var newRecordBtn = this.newRecordBtn;
            var thisApp = this;
            

            var count = table.rows.length;
            
            for(var x=1; x<count; x++){
                // console.log(x);
                table.deleteRow(x);
                count = count - 1;
                x = x - 1;
            }
            
            /***
             * Bind pop-up form for each value cell in table, with relevant call out event as well as changed data input logic.
             * @WARNING CLOSURE FUNCTION, DO NOT MOVE OUTSEIDE!
             * @param {HTMLTableCellElement} value
             * @param {number} index
             * @param {[string]} existingRecordInfo
             */
            function cellEventsDeploy(value,index, existingRecordInfo){
                let originRecordLength = existingRecordInfo.length;

                clearTimeout(timer);
                // remove last pop up form 
                if(root.getElementById("table_pop_up")!=null){
                    tableBody.removeChild(root.getElementById("table_pop_up"));
                }
                // create pop up element
                var tablePopUp = document.createElement("div");
                tablePopUp.setAttribute("id","table_pop_up");                             
                // get current cell's position
                var position = value.getBoundingClientRect();
                // set relevant position of the pop up based on current cell's position
                tablePopUp.style.left = (position.left - 50).toString()+"px";
                if(index === data.length-1){
                    tablePopUp.style.top = (position.bottom - position.height*2).toString() + "px"; 
                }else{
                    tablePopUp.style.top = position.bottom.toString()+"px";
                }
                
                // create input element
                var inputForm = document.createElement("input");
                inputForm.setAttribute("id", "table_input");
                inputForm.type = "text";
                inputForm.value = value.textContent;
                inputForm.onchange = e =>{
                    if(inputForm.value !=value.textContent){
                        
                        submitBtn.style.backgroundColor = "rgb(24, 119, 136)";
                        submitBtn.disabled = false;
                        submitBtn.onclick = e =>{
                            if(existingRecordInfo.length != originRecordLength){
                                existingRecordInfo.pop(existingRecordInfo[existingRecordInfo.length - 1]);
                            }
                            existingRecordInfo.push(inputForm.value)
                            thisApp.existingRecord = existingRecordInfo;
                            var changeExistingRecordEvent = new Event("onChangeExistingRecord");
                            thisApp.dispatchEvent(changeExistingRecordEvent);
                            value.textContent = inputForm.value;
                        }
                    }
                    if(inputForm.value === value.textContent){
                        submitBtn.style.backgroundColor = "rgb(209, 209, 209)";
                        submitBtn.disabled = true;
                    }
                }
                // create submit btn
                var submitBtn = document.createElement("button");
                submitBtn.setAttribute("id","table_submit_btn");
                // add input and button into input form 
                tablePopUp.appendChild(inputForm);
                tablePopUp.appendChild(submitBtn);
                // add into app display
                root.getElementById("table_body").appendChild(tablePopUp);
                // button disappear
                newRecordBtn.style.bottom = "-16%";
            }

            // start to deploy cell events
            if(type === "Project Support"){
                // change table display style
                table.getElementsByClassName("audience").item(0).style.display = "none";
                table.getElementsByClassName("count").item(0).style.display = "none";
                table.getElementsByClassName("man_hour").item(0).style.display = "table-cell";
                 // read value and fill in dimensions
                 for(let i = 0; i < data.length; i++){
                    // a table row representing a record
                    let row = document.createElement("tr");
                    // a table cell representing customer name
                    let customer = document.createElement("td");
                    customer.setAttribute("class","customer_name");
                    customer.textContent = data[i].Customer.id;
                    // insert the generated table cell into table row
                    row.appendChild(customer);              
                    // a table cell representing relevant working value
                    let value1 = document.createElement("td");
                    value1.setAttribute("class", "value");
                    value1.textContent = data[i]["@MeasureDimension"].rawValue;
                    // insert the generated table cell into table row
                    row.appendChild(value1);
                    // deploy cell events
                    value1.onmousedown = e =>{
                        timer = setTimeout(function(){
                            cellEventsDeploy(value1,i, [data[i].Type.id, data[i].Customer.id, data[i].Date.id, data[i]["@MeasureDimension"].id])
                        },500);
                    }
                    value1.onmouseup = e =>{
                        clearTimeout(timer);
                    }
                    value1.onmousemove = e =>{
                        clearTimeout(timer);
                    }
                    // insert the record into table
                    table.appendChild(row);

                }
            }else{    
                if (type === "Deal Support"){
                    table.getElementsByClassName("audience").item(0).style.display = "none";
                    table.getElementsByClassName("count").item(0).style.display = "table-cell";
                    table.getElementsByClassName("man_hour").item(0).style.display = "table-cell";
                }else if(type === "Enablement"){
                    table.getElementsByClassName("audience").item(0).style.display = "table-cell";
                    table.getElementsByClassName("count").item(0).style.display = "table-cell";
                    table.getElementsByClassName("man_hour").item(0).style.display = "none";
                }
                 // read value and fill in dimensions
                for(let i = 0; i < data.length; i+=2){
                    let row = document.createElement("tr");

                    let customer = document.createElement("td");
                    customer.setAttribute("class","customer_name");
                    customer.textContent = data[i].Customer.id;
                    row.appendChild(customer);

                    let value1 = document.createElement("td");
                    value1.setAttribute("class", "value");
                    value1.textContent = data[i]["@MeasureDimension"].rawValue;
                    row.appendChild(value1);

                    let value2 = document.createElement("td");
                    value2.setAttribute("class", "value");
                    value2.textContent = data[i+1]["@MeasureDimension"].rawValue;
                    row.appendChild(value2);

                    // deploy cell events
                    value1.onmousedown = e =>{
                        timer = setTimeout(function(){cellEventsDeploy(value1,i,[data[i].Type.id, data[i].Customer.id, data[i].Date.id,data[i]["@MeasureDimension"].id, data[i+1]["@MeasureDimension"].rawValue])},500);
                    }
                       
                    value2.onmousedown = e =>{
                        timer = setTimeout(function(){cellEventsDeploy(value2,i,[data[i+1].Type.id, data[i+1].Customer.id, data[i+1].Date.id,data[i+1]["@MeasureDimension"].id, data[i]["@MeasureDimension"].rawValue])},500);
                    }

                    value1.onmouseup = e =>{
                        clearTimeout(timer);
                    }
                    value2.onmouseup = e =>{
                        clearTimeout(timer);
                    }
                    value1.onmousemove = e =>{
                        clearTimeout(timer);
                    }
                    value2.onmousemove = e =>{
                        clearTimeout(timer);
                    }
                    table.appendChild(row);
                }
            }
        }

        /**
         * gets the data set and split into different parts 
         * @param {Array<{"@MeasureDimension":{id:string, description:string, parentId:string, rawValue:string, formattedValue:string}
         * ,Customer:{id:string, description:string, parentId:string, properties:{}}
         * ,Date:{id:string, description:string, parentId:string, properties:{}}
         * ,Type:{id:string, description:string, parentId:string, properties:{}}
         * ,User:{id:string, description:string, parentId:string, properties:{}}}>} data
         */
        dataProcessing(data){
            let dealSupSetCurrentArray = new Array();
            let dealSupSetLastArray = new Array();
            let enableSetCurrentArray = new Array();
            let enableSetLastArray = new Array();
            let projSupSetCurrentArray = new Array();
            let projSupSetLastArray = new Array();

            
            for (var i=0; i< data.length; i++){
                if (data[i].Type.id === "Deal Support"){
                    if(data[i].Date.id === this.thisMon){
                        dealSupSetCurrentArray.push(data[i]);
                    }
                    if(data[i].Date.id === this.lastMon){
                        dealSupSetLastArray.push(data[i]);
                    }
                }else if(data[i].Type.id === "Enablement"){
                    if(data[i].Date.id === this.thisMon){
                        enableSetCurrentArray.push(data[i]);
                    }
                    if(data[i].Date.id === this.lastMon){
                        enableSetLastArray.push(data[i]);
                    }
                }else if(data[i].Type.id === "Project Support"){
                    if(data[i].Date.id === this.thisMon){
                        projSupSetCurrentArray.push(data[i]);
                    }
                    if(data[i].Date.id === this.lastMon){
                        projSupSetLastArray.push(data[i]);
                    }
                }
            }
            this.dealSupSetCurrent = dealSupSetCurrentArray;
            this.dealSupSetLast = dealSupSetLastArray;
            this.enableSetCurrent = enableSetCurrentArray;
            this.enableSetLast = enableSetLastArray;
            this.projSupSetCurrent = projSupSetCurrentArray;
            this.projSupSetLast = projSupSetLastArray;

            // this month data deploy
            this.deployData(this.dealSupSetCurrent, this.dealSupTable, "Deal Support");
            this.deployData(this.enableSetCurrent,this.enableTable,"Enablement");
            this.deployData(this.projSupSetCurrent,this.projSupTable,"Project Support");
        }

        /***
         * @param {Array<{dimensionId:string,id:string,description:string,displayId:string,modelId:string}>} names
         */
        deployCustomerName(names){
            let newNames = new Array();
            for(let i = 0; i < names.length; i++){
                newNames.push(names[i].id);
            }
            this.names = newNames;
            console.log(this.names.length);
        }
        
        /***
         * deploy customer ids based on input value in input session
         * 1. get the input value
         * 2. filtres custom names/ids based on user input
         * 3. deploy filtred names into drop down snippet
         * @param {string} input
         * @var 
         */
         _inputRecommendation(input){
            var names = new Array();
            var index=0;
            var number = this.inputOverlay.childElementCount;
            
            // filtre names
            for (let i=0; i < this.names.length; i++){
                var customerName = this.names[i];
                if (customerName.toLowerCase().includes(input.toLowerCase())){
                    if (input === customerName){
                        continue;
                    }
                    names.push(customerName);
                    if(names.length === 20){
                        break;
                    }
                }                                                                                  
            }

            // deploy selected names
            for(let i = 0; i < names.length; i++){
                var selected_name = names[i];
                index = i;
                if (number != 0){
                    if (i > number - 1){
                        let customerSnippet = document.createElement("a");
                        customerSnippet.setAttribute('class', 'snippet');
                        customerSnippet.text = selected_name;
                        customerSnippet.onclick = e =>{
                            this.customerInput.value = customerSnippet.textContent;
                            this.inputOverlay.style.display = "none";
                        }
                        this.inputOverlay.appendChild(customerSnippet);
                    }else{
                        this.inputOverlay.children.item(i).textContent = selected_name;
                    }
                }else{
                    let customerSnippet = document.createElement("a");
                    customerSnippet.setAttribute('class', 'snippet');
                    customerSnippet.text = selected_name;
                    customerSnippet.onclick = e =>{
                        this.customerInput.value = customerSnippet.textContent;
                        this.inputOverlay.style.display = "none";
                    }
                    this.inputOverlay.appendChild(customerSnippet);
                }
            }
            // remove redundant
            while(index < this.inputOverlay.childElementCount){
                this.inputOverlay.removeChild(this.inputOverlay.children.item(index));
            }
        }

        /**
         * check whether name already exists
         * @param {string} name
         */
        _newNameCheck(name){
            if(this.names.includes(name)){
                return true;
            }
            return false;
        }

        inputFormEvents(){
            this.customerInput.focus();
            this.inputOverlay.style.display = "block";
            this._inputRecommendation(this.customerInput.value);
            if(this.customerInput.value != ''){
                this.fillInBtn.disabled = false;
                this.fillInBtn.style.backgroundColor = "rgb(24, 119, 136)";
                this.fillInBtn.style.color = "white";
            }
        }

        fillInBtnEvents(){
            let root = this.shadowRoot;
            this.inputOverlay.style.display = "none";
            if(this.customerInput.value === ""){
                // generate and display a warning message
                var warning_msg = document.createElement("div");
                warning_msg.setAttribute("id","warning_msg");
                var msg = document.createElement("div");
                msg.textContent = "You can't add or select a customer with empty name!";
                warning_msg.appendChild(msg);
                this.shadowRoot.appendChild(warning_msg);
                // remove the temp generated warning message
                var tempTimer = setTimeout(function(){
                    clearTimeout(tempTimer);
                    root.removeChild(root.getElementById("warning_msg"));
                    // console.log(root.getElementById("warning_msg"));
                },3000);
            }else{
                if(this._newNameCheck(this.customerInput.value)){
                    this.widgetLoad(1);
                }else{
                    this.selectionsWidgetsEnableSwitch(true);
                    this.customerInput.disabled = true;
                    this.fillInBtn.disabled = true;
                    // generate and display a hint pop up msg
                    var popUpMsg = document.createElement("div");
                    var info = document.createElement("div");
                    var closePopUpBtn = document.createElement("button");
                    var determineBtn = document.createElement("button");
                    popUpMsg.setAttribute("id","pop_up_msg");
                    closePopUpBtn.setAttribute("id","close_pop_up_btn");
                    determineBtn.setAttribute("id","determine_btn");
                    info.textContent = "This is a new customer, do you want to add it into your database?";
                    closePopUpBtn.textContent = "No";
                    determineBtn.textContent = "Yes";
                    // button events
                    closePopUpBtn.onclick = e => {
                        this.closePopUpMsg(popUpMsg);
                    }

                    determineBtn.onclick = e =>{
                        this.closePopUpMsg(popUpMsg);
                        this.widgetLoad(2);
                    }
                    // assembly
                    popUpMsg.appendChild(info);
                    popUpMsg.appendChild(closePopUpBtn);
                    popUpMsg.appendChild(determineBtn);
                    this.shadowRoot.appendChild(popUpMsg);
                }
            }
        }

        /***
         * make change on current manipulation widget in order to display value input widgets inside based on specific scenario
         * @param {string} type the selected working type
         * @param {string} scenario the current manipulation widget
         */
        widgetLoad(scenario){
            var manipulWidget = this.shadowRoot.getElementById("new_record_page");
            var standardInterval = 0;
            var standardHeight = 0;
            var topIndex= 0;
            var standardTop = 0;

            if(scenario != 3){
                var navMonth = this.shadowRoot.getElementById("nav_month");
                var navType = this.shadowRoot.getElementById("nav_type");
                var customerInputLabel = this.shadowRoot.getElementById("customer_label");

                // convert percentage position info into real px info and set to existing widgets
                standardHeight = navMonth.offsetHeight;
                
                // fixed their height for avoiding stretching when meet the change of size of manipulation widget
                navMonth.style.height = standardHeight.toString() + "px";
                navType.style.height = standardHeight.toString() + "px";
                this.customerInput.style.height = standardHeight.toString() + "px";
                customerInputLabel.style.height = standardHeight.toString() + "px";

                // calculate the stardard top info for re-arrange widgets and new widgets
                navMonth.style.top = "5%";
                standardTop = navMonth.offsetTop;
                standardInterval = standardHeight + standardTop;
                navType.style.top = (standardTop + standardInterval).toString() + "px";
                this.customerInput.style.top = (standardTop + standardInterval*2).toString() + "px";
                customerInputLabel.style.top = (standardTop + standardInterval*2).toString() + "px";

                // disable useless widgets
                this.selectionsWidgetsEnableSwitch(true);
                this.customerInput.disabled = true;
                
                // the last index is used for add new widgets
                topIndex = standardTop + standardInterval*2;

                // fill in button adjustment
                this.fillInBtn.textContent = "Back";
                this.fillInBtn.style.backgroundColor = "#3498DB";
                this.fillInBtn.style.height = this.fillInBtn.offsetHeight.toString() + "px";
                this.fillInBtn.style.width = this.fillInBtn.offsetWidth.toString() + "px";
                this.fillInBtn.style.left = "5%";
                

                this.fillInBtn.onclick = e =>{
                    this.newRecordPageResetEvent();
                }

                // add relevant widgets based on scenario
                if(scenario === 1){
                    this.valueInputWidgetLoad(this.typeFilter, manipulWidget, topIndex, standardHeight, standardInterval, 1);
                    var submitBtn = this.manipulBtnRender("Submit");
                    submitBtn.setAttribute("id","submit_new_record_btn");
                    manipulWidget.appendChild(submitBtn);

                    submitBtn.onclick = e =>{
                        var transferNewRecordEvent = new Event("onNewRecordTransfer");
                        this.dispatchEvent(transferNewRecordEvent);
                    }
                }else if(scenario == 2){
                    this.newCustomerWidgetLoad(manipulWidget, topIndex, standardHeight, standardInterval);
                    var nextStepBtn = this.shadowRoot.getElementById("next_to_value_filling_btn");

                    nextStepBtn.onclick = e =>{
                        this.widgetLoad(3);
                        this.descriptionAndCustomerTypeWidgetsEnableSwitch(true);
                        
                    }
                }

            }else{
                var standardTop = this.newRecordPage.children.item(0).offsetTop;
                var standardHeight = this.newRecordPage.children.item(0).offsetHeight;
                var standardInterval = standardTop + standardHeight;
                var selections = this.newRecordPage.getElementsByClassName("selection_form");
                var topIndex = selections.item(selections.length - 1).offsetTop;
                
                this.valueInputWidgetLoad(this.typeFilter, manipulWidget, topIndex, standardHeight, standardInterval, 3);

                var nextStepBtn = this.shadowRoot.getElementById("next_to_value_filling_btn");
                manipulWidget.removeChild(nextStepBtn);

                var addNewCustomerAndRecordBtn = this.manipulBtnRender("Submit");
                addNewCustomerAndRecordBtn.setAttribute("id","submit_new_customer_and_widget_btn");
                manipulWidget.appendChild(addNewCustomerAndRecordBtn);

                this.fillInBtn.onclick = e =>{
                    this.backToNewCustomerEvent(this.typeFilter);
                }

                addNewCustomerAndRecordBtn.onclick = e =>{
                    var addNewCustomerEvent = new Event("onAddNewCustomer");
                    this.dispatchEvent(addNewCustomerEvent);
                }
            }
        }
        
        /***
         * load value input widgets based on selected work type
         * @param {string} type
         * @param {HTMLElement} manipulWidget
         * @param {number} index
         * @param {number} standardHeight 
         * @param {number} standardInterval
         * @param {number} scenario
         */
        valueInputWidgetLoad(type, manipulWidget, index, standardHeight, standardInterval, scenario){
            
            if(type==="Deal Support" || type==="Enablement"){
                // extend height for new added widget
                if(scenario === 1){
                    manipulWidget.style.height = "45%";
                }else if(scenario === 3){
                    manipulWidget.style.height = "65%";
                }
                // create general new input widgets based on type
                var widgetsCount = this.valueInputwidgetGeneralRender("Count");
                var countValInputLabel = widgetsCount.label;
                var countValInput = widgetsCount.inputCover;
                // set height
                countValInputLabel.style.height = standardHeight + "px";
                countValInput.style.height = standardHeight + "px";
                // set relevant attributes
                countValInputLabel.setAttribute("id","count_value_label");
                countValInput.getElementsByTagName("input").item(0).setAttribute("id","count_value_input");
                // set value and style
                index = index + standardInterval;
                countValInputLabel.style.top = index.toString() + "px";
                countValInput.style.top = index.toString() + "px";
                // add into manipulation widget
                manipulWidget.appendChild(countValInputLabel);
                manipulWidget.appendChild(countValInput);

                // create specified new input widget based on type
                if(type==="Deal Support"){
                    var widgetsManHour = this.valueInputwidgetGeneralRender("Man Hour");
                    var manHourInputLabel = widgetsManHour.label;
                    var manHourInput = widgetsManHour.inputCover;
                    // set height
                    manHourInputLabel.style.height = standardHeight + "px";
                    manHourInput.style.height = standardHeight + "px";
                    // set relevant attributes
                    manHourInputLabel.setAttribute("id","manhour_value_label");
                    manHourInput.getElementsByTagName("input").item(0).setAttribute("id","manhour_value_input");
                    // set value and style
                    index = index + standardInterval;
                    manHourInputLabel.style.top = index.toString() + "px";
                    manHourInput.style.top = index.toString() + "px";
                    // add into manipulation widget
                    manipulWidget.appendChild(manHourInputLabel);
                    manipulWidget.appendChild(manHourInput);
                }else if(type==="Enablement"){
                    var widgetsAudience = this.valueInputwidgetGeneralRender("Audience");
                    var audienceInputLabel = widgetsAudience.label;
                    var audienceInput = widgetsAudience.inputCover;
                    // set height
                    audienceInputLabel.style.height = standardHeight + "px";
                    audienceInput.style.height = standardHeight + "px";
                    // set relevant attributes
                    audienceInputLabel.setAttribute("id","audience_value_label");
                    audienceInput.getElementsByTagName("input").item(0).setAttribute("id","audience_value_input");
                    // set value and style
                    index = index + standardInterval;
                    audienceInputLabel.style.top = index.toString() + "px";
                    audienceInput.style.top = index.toString() + "px";
                    // add into manipulation widget
                    manipulWidget.appendChild(audienceInputLabel);
                    manipulWidget.appendChild(audienceInput);
                }
            }else if(type === "Project Support"){
                if(scenario === 1){
                    manipulWidget.style.height = "40%";
                }else if(scenario === 3){
                    manipulWidget.style.height = "60%";
                }
                var widgetsManHour = this.valueInputwidgetGeneralRender("Man Hour");
                var manHourInputLabel = widgetsManHour.label;
                var manHourInput = widgetsManHour.inputCover;
                // set height
                manHourInputLabel.style.height = standardHeight + "px";
                manHourInput.style.height = standardHeight + "px";
                // set relevant attributes
                manHourInputLabel.setAttribute("id","manhour_value_label");
                manHourInput.getElementsByTagName("input").item(0).setAttribute("id","manhour_value_input");
                // set value and style
                index = index + standardInterval;
                manHourInputLabel.style.top = index.toString() + "px";
                manHourInput.style.top = index.toString() + "px";
                // add into manipulation widget
                manipulWidget.appendChild(manHourInputLabel);
                manipulWidget.appendChild(manHourInput);
            }

        }

        /**
         * render value input widgets
         * @param {string} text
         */
        valueInputwidgetGeneralRender(text){
            // create element
            var label =  document.createElement("div");
            var labelText =  document.createElement("div");
            var inputCover = document.createElement("div");
            var input = document.createElement("input");
            // set general attribute
            label.setAttribute("class","value_input_label");
            input.setAttribute("class","value_input_form");
            inputCover.setAttribute("class","value_input_cover");
            // assembly 
            labelText.textContent = text;
            label.appendChild(labelText);
            inputCover.appendChild(input);

            return {label, inputCover};
        }

        /***
         * render selection widgets
         * @param {string} text 
         * @param {Array} options 
         */
        dropDownSelectionWidgetsRender(text,options){

            var label = document.createElement("div");
            var labelText =  document.createElement("div");
            var selection = document.createElement("select");

            label.setAttribute("class", "value_input_label");
            selection.setAttribute("class","selection_form");
            selection.setAttribute("id", text+"_selection");

            labelText.textContent = text;
            label.appendChild(labelText);

            for(let i=0; i<options.length; i++){
                var option = document.createElement("option");
                option.setAttribute("class", "selection_widget_opt");
                option.textContent = options[i];
                selection.appendChild(option);
            }

            return {label, selection};
        }

        /***
         * render manipulation button 
         * @param {number} width
         * @param {number} height
         * @param {string} text
         */
        manipulBtnRender(text){
            var btn = document.createElement("button");
            btn.setAttribute("class", "manipulation_button");
            btn.style.width = this.fillInBtn.offsetWidth.toString() + "px";
            btn.style.height = this.fillInBtn.offsetHeight.toString() + "px";
            btn.style.right = "5%";
            btn.textContent = text;
            
            return btn;
        }


        /**
         * disable the work type selection widgets and month selection widgets on manipulation widget
         * @param {boolean} mode
         */
        selectionsWidgetsEnableSwitch(mode){
            this.dealSupFilter.disabled = mode;
            this.enableOptFilter.disabled = mode;
            this.projSupFilter.disabled = mode;
            this.thisMonthFilter.disabled = mode;
            this.lastMonthFilter.disabled = mode;
        }

        /***
         * disable the description widget and customer type selection widgets on manipulation widget
         * @param {boolean} mode
         */
        descriptionAndCustomerTypeWidgetsEnableSwitch(mode){

            var selections = this.newRecordPage.getElementsByClassName("selection_form");
            for(let i = selections.length-1; i>=0; i--){
                selections.item(i).disabled = mode;
            }
            this.shadowRoot.getElementById("new_customer_description_input").disabled = mode;
        }

        /***
         * load new customer widgets
         * @param {HTMLElement} manipulWidget
         * @param {number} index
         * @param {number} standardHeight 
         * @param {number} standardInterval
         */
        newCustomerWidgetLoad(manipulWidget, index, standardHeight, standardInterval){
            manipulWidget.style.height = "55%";
            var widgetNewCustomDescription = this.valueInputwidgetGeneralRender("Description");
            var newCustomerDescripLabel = widgetNewCustomDescription.label;
            var newCustomerDescripInput = widgetNewCustomDescription.inputCover;

            newCustomerDescripLabel.setAttribute("id","new_customer_description_label");
            newCustomerDescripInput.getElementsByTagName("input").item(0).setAttribute("id","new_customer_description_input");

            var customerTypeSelectionWidgets = this.dropDownSelectionWidgetsRender("Customer Type", ["Internal","Partner"]);
            var customerTypeSelectionLabel = customerTypeSelectionWidgets.label;
            var customerTypeSelection = customerTypeSelectionWidgets.selection;

            var regionTypeSelectionWidgets = this.dropDownSelectionWidgetsRender("Region", ["GC","APJ","Other"]);
            var regionTypeSelectionLabel = regionTypeSelectionWidgets.label;
            var regionTypeSelection = regionTypeSelectionWidgets.selection;

            index = index + standardInterval;
            newCustomerDescripLabel.style.top = index.toString() + "px";
            newCustomerDescripInput.style.top = index.toString() + "px";
            newCustomerDescripLabel.style.height = standardHeight + "px";
            newCustomerDescripInput.style.height = standardHeight + "px";

            index = index + standardInterval;
            customerTypeSelectionLabel.style.top = index.toString() + "px";
            customerTypeSelection.style.top = index.toString() + "px";
            customerTypeSelectionLabel.style.height = standardHeight + "px";
            customerTypeSelection.style.height = standardHeight + "px";

            index = index + standardInterval;
            regionTypeSelectionLabel.style.top = index.toString() + "px";
            regionTypeSelection.style.top = index.toString() + "px";
            regionTypeSelectionLabel.style.height = standardHeight + "px";
            regionTypeSelection.style.height = standardHeight + "px";

            var nextStepBtn = this.manipulBtnRender("Next");
            nextStepBtn.setAttribute("id","next_to_value_filling_btn");
            

            manipulWidget.appendChild(newCustomerDescripLabel);
            manipulWidget.appendChild(newCustomerDescripInput);
            manipulWidget.appendChild(customerTypeSelectionLabel);
            manipulWidget.appendChild(customerTypeSelection);
            manipulWidget.appendChild(regionTypeSelectionLabel);
            manipulWidget.appendChild(regionTypeSelection);
            manipulWidget.appendChild(nextStepBtn);
        }

        /**
         * close the pop up message
         * @param {HTMLElement} popUpMsg
         */
        closePopUpMsg(popUpMsg){
            var root = this.shadowRoot;
            popUpMsg.style.opacity = "0%";
            this.selectionsWidgetsEnableSwitch(false);
            this.customerInput.disabled = false;
            this.fillInBtn.disabled = false;
            var timer = setTimeout(function(){
                clearTimeout(timer);
                root.removeChild(root.getElementById("pop_up_msg"));
            }, 600);
        }

        /***
         * reset the new record page
         */
        newRecordPageResetEvent(){
            let labels = this.newRecordPage.getElementsByClassName("value_input_label");
            let inputs = this.newRecordPage.getElementsByClassName("value_input_cover");
            let selections = this.newRecordPage.getElementsByClassName("selection_form");
            
            for(let i = labels.length-1; i>=0; i--){
                let label = labels.item(i);
                this.newRecordPage.removeChild(label);
            }

            for(let j = inputs.length-1; j>=0; j--){
                this.newRecordPage.removeChild(inputs.item(j));
            }

            for(let k = selections.length -1; k>=0; k--){
                this.newRecordPage.removeChild(selections.item(k));
            }

            this.newRecordPage.style.height = "30%";

            this.selectionsWidgetsEnableSwitch(false);
            this.customerInput.disabled = false;

            this.shadowRoot.getElementById("nav_month").style.top = "10%";
            this.shadowRoot.getElementById("nav_type").style.top = "30%";
            this.customerInput.style.top = "50%";
            this.shadowRoot.getElementById("customer_label").style.top = "50%";
            this.fillInBtn.style.left = "41%";
            this.fillInBtn.textContent = "Next";
            this.fillInBtn.style.backgroundColor = "rgb(24, 119, 136)";

            var nextStepBtn = this.shadowRoot.getElementById("next_to_value_filling_btn");
            if( nextStepBtn!= null){
                this.newRecordPage.removeChild(nextStepBtn);
            }

            var submitNewRecordBtn = this.shadowRoot.getElementById("submit_new_record_btn"); 
            if(submitNewRecordBtn != null){
                this.newRecordPage.removeChild(submitNewRecordBtn);
            }

            var addNewCustomerAndRecordBtn = this.shadowRoot.getElementById("submit_new_customer_and_widget_btn")
            if(addNewCustomerAndRecordBtn != null){
                this.newRecordPage.removeChild(addNewCustomerAndRecordBtn);
            }

            this.fillInBtn.onclick = e =>{
                this.fillInBtnEvents();
            }
        }

        /***
         * return to the interface that construct the customer description and customer type
         */
        backToNewCustomerEvent(type){
            if(type === "Project Support"){
                this.newRecordPage.removeChild(this.shadowRoot.getElementById("manhour_value_input").parentNode);
                this.newRecordPage.removeChild(this.shadowRoot.getElementById("manhour_value_label"));
            }else{
                this.newRecordPage.removeChild(this.shadowRoot.getElementById("count_value_input").parentNode);
                this.newRecordPage.removeChild(this.shadowRoot.getElementById("count_value_label"));

                if (type === "Deal Support"){
                    this.newRecordPage.removeChild(this.shadowRoot.getElementById("manhour_value_input").parentNode);
                    this.newRecordPage.removeChild(this.shadowRoot.getElementById("manhour_value_label"));

                }else if(type === "Enablement"){
                    this.newRecordPage.removeChild(this.shadowRoot.getElementById("audience_value_input").parentNode);
                    this.newRecordPage.removeChild(this.shadowRoot.getElementById("audience_value_label"));
                }
            }

            this.newRecordPage.style.height = "55%";

            var nextStepBtn = this.manipulBtnRender("Next");
            nextStepBtn.setAttribute("id","next_to_value_filling_btn");
            this.newRecordPage.appendChild(nextStepBtn);

            nextStepBtn.onclick = e =>{
                this.widgetLoad(3);
                this.descriptionAndCustomerTypeWidgetsEnableSwitch(true);
            }
                
            var addNewCustomerAndRecordBtn = this.shadowRoot.getElementById("submit_new_customer_and_widget_btn");
            this.newRecordPage.removeChild(addNewCustomerAndRecordBtn);

            this.fillInBtn.onclick = e =>{
                this.newRecordPageResetEvent();
            }

            this.descriptionAndCustomerTypeWidgetsEnableSwitch(false);
            
        }

        /***
         * events of new record button
         */
        newRecordBtnOpenAndCloseManipulationWidgetEvent(){
            if(this.newRecordBtn.textContent === "Add"){
                this.newRecordPage.style.bottom = "10%";
                this.newRecordBtn.textContent = "Close";
                this.fillInBtn.style.backgroundColor="#f7f7f7";
                this.fillInBtn.disabled = true;
            }else{
                if(this.newRecordBtn.textContent === "Close"){
                    this.newRecordPageResetEvent();
                    this.newRecordPage.style.bottom = "-50%";
                    this.newRecordBtn.textContent = "Add";
                    this.customerInput.value = '';
                    this.fillInBtn.style.color = "rgb(102, 101, 101)";
                    this.inputOverlay.style.display = "none";
                }
            }
        }

        /***
         * transfer new record data from app to SAC
         */
        transferNewRecordIntoSAC(){
            var countValInput = this.shadowRoot.getElementById("count_value_input");
            var manHourInput = this.shadowRoot.getElementById("manhour_value_input");
            var audienceInput = this.shadowRoot.getElementById("audience_value_input");
            if(this.typeFilter == "Deal Support"){
                return [this.customerInput.value, this.monthFilter, this.typeFilter, countValInput.value, manHourInput.value];
            }else if(this.typeFilter === "Enablement"){
                return [this.customerInput.value, this.monthFilter, this.typeFilter, countValInput.value, audienceInput.value];
            }else if(this.typeFilter === "Project Support"){
                return [this.customerInput.value, this.monthFilter, this.typeFilter, manHourInput.value];
            }
        }

        /**
         * transfer new customer data from app to SAC
         */
        transferNewCustomerIntoSAC(){
            var newCustomerId = this.customerInput.value;
            var newCustomerDescription = this.shadowRoot.getElementById("new_customer_description_input").value;
            var newCustomerType = this.shadowRoot.getElementById("Customer Type_selection").value;
            var newCustomerRegion = this.shadowRoot.getElementById("Region_selection").value;

            return [newCustomerId,newCustomerDescription,newCustomerType,newCustomerRegion];
        }

        /**
         * transfer updated existing record from app to SAC 
         * @returns [string]
         */
        transferUpdatedExistingRecordIntoSAC(){
            return this.existingRecord;
        }

    }


    customElements.define("com-sap-martinsfillinapp", App);
})();