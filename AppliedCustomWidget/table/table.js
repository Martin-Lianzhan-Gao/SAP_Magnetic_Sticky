(function(){
    class InteractiveTable extends HTMLElement{
        constructor(){
            super();
            let shadowRoot = this.attachShadow({mode: "open"});
            let template = document.createElement("template");
            template.innerHTML = `
                <div>
                    <table id="interactive_table">
                        <tr>
                            <th>Customer</th>
                            <th id="count">Count</th>
                            <th id="man_hour">Man Hour</th>
                            <th id="audience">Audience</th>
                        </tr>
                    </table>
                </div>
                <style>
                    @import "http://localhost:3000/AppliedCustomWidget/table/table.css"
                </style>
            `;

            // deploy html into shadow root
            shadowRoot.appendChild(template.content.cloneNode(true));
        }

        /***
         * load datas of data source of a table in app design and stores them into interactive
         * tables.
         * @param {Array<{"@MeasureDimension":string,Type:string, Customer:string, Date:string, User:string}>} dimensions
         * @param {Array<{rawValue:string, formattedValue:string}>} values
         */
        loadData(dimensions,values,type){
            // table
            var table = this.shadowRoot.getElementById("interactive_table");

            if(type === "Project Support"){
                this.shadowRoot.getElementById("audience").style.display = "none";
                this.shadowRoot.getElementById("count").style.display = "none";
                this.shadowRoot.getElementById("man_hour").style.display = "table-cell";

                 // read value and fill in dimensions
                 for(var i = 0; i < dimensions.length; i++){
                    var row = document.createElement("tr");

                    var customer = document.createElement("td");
                    customer.setAttribute("class","customer_name");
                    customer.textContent = dimensions[i].Customer;
                    row.appendChild(customer);

                    var value1 = document.createElement("td");
                    value1.setAttribute("class", "value");
                    value1.textContent = values[i].rawValue;
                    row.appendChild(value1);

                    table.appendChild(row);
                }


            }else{    
                if (type === "Deal Support"){
                    this.shadowRoot.getElementById("audience").style.display = "none";
                    this.shadowRoot.getElementById("count").style.display = "table-cell";
                    this.shadowRoot.getElementById("man_hour").style.display = "table-cell";
                }else if(type === "Enablement"){
                    this.shadowRoot.getElementById("audience").style.display = "table-cell";
                    this.shadowRoot.getElementById("count").style.display = "table-cell";
                    this.shadowRoot.getElementById("man_hour").style.display = "none";
                }
                 // read value and fill in dimensions
                for(var i = 0; i < dimensions.length; i+=2){
                    var row = document.createElement("tr");

                    var customer = document.createElement("td");
                    customer.setAttribute("class","customer_name");
                    customer.textContent = dimensions[i].Customer;
                    row.appendChild(customer);

                    var value1 = document.createElement("td");
                    value1.setAttribute("class", "value");
                    value1.textContent = values[i].rawValue;
                    row.appendChild(value1);

                    var value2 = document.createElement("td");
                    value2.setAttribute("class", "value");
                    value2.textContent = values[i+1].rawValue;
                    row.appendChild(value2);

                    table.appendChild(row);
                }
            }
        }
    }

    customElements.define("com-sap-martinsinteractivetable", InteractiveTable);
})();