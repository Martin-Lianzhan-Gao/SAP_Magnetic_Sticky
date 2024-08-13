(function(){

    /***
     * Temporarily useless
     */
    class subStrNode {
        constructor(){
            this.value = undefined;
            this.isEnd = false;
            this.array = new Array();
        }
    }


    /**
     * Temporarily useless
     */
    class subStrTree {
        constructor(){
            this.rootNode = new subStrNode();
        }

        _insert(subStr, val){
            let root = this.rootNode;

        }
    }

    class DropDown extends HTMLElement{
        constructor(){
            super();
            let shadowRoot = this.attachShadow({mode: "open"});
            let template = document.createElement("template");

            template.innerHTML=`
                <div id= "body" class="body">
                    <input type="text" id="cname" placeholder="Type your customer name...">
                    <button id="dropBtn">
                    </button>
                    <div id="overlay" class="dropdown_content">
                        <a class="snippet">A</a> <a class="snippet">B</a> <a class="snippet">C</a> <a class="snippet">D</a> <a class="snippet">E</a> <a class="snippet">F</a> <a class="snippet">G</a>
                        <a class="snippet">H</a> <a class="snippet">I</a> <a class="snippet">J</a> <a class="snippet">K</a> <a class="snippet">L</a> <a class="snippet">M</a> <a class="snippet">N</a>
                        <a class="snippet">O</a> <a class="snippet">P</a> <a class="snippet">Q</a> <a class="snippet">R</a> <a class="snippet">S</a> <a class="snippet">T</a> <a class="snippet">U</a>
                        <a class="snippet">V</a> <a class="snippet">W</a> <a class="snippet">X</a> <a class="snippet">Y</a> <a class="snippet">Z</a>
                    </div>
                    <div id="alphabet_overlay" class="dropdown_content">
                    </div>
                    <div id="input_overlay" class="recommend_content">
                    </div>
                    <style>
                        @import "http://localhost:3000/AppliedCustomWidget/dropdown/style.css";
                    </style>
                    <script src="http://localhost:3000/AppliedCustomWidget/jquery-3.6.0.min.js"></script>
                </div>

                <div id= "notification" class="assisstant_part">
                    <p>Oops! Your typed customer name is not in database, do you want to add it now?</p>
                    <button class="notify_btn" id="no">No</button>
                    <button class="notify_btn" id="yes">Yes</button>
                </div>
                <div id= "supplementary_form" class="supplementary_part">
                    <p>Please fill in following supplementary info</p>
                    <label class="label">Description</label>
                    <input type="text" id="description" placeholder="Please provide your customer description..."></input>
                    <label class="label">Region</label>
                    <select id="region_select">
                        <option class="selection">APJ</option>
                        <option class="selection">GC</option>
                        <option class="selection">Other</option>
                    </select>
                    <label class="label">Customer Type</label>
                    <select id="custom_type">
                        <option class="selection">Internal</option>
                        <option class="selection">Partner</option>
                    </select>
                </div>
                <div id="value_fillin" class="fillin">
                    <p>Please fill in your working data</p>
                    <label class="label">Count</label>
                    <input type="text" id="count_val">
                    <label class="label">Man Hour</label>
                    <input type="text" id="manhour_val">
                    <label class="label">Audience</label>
                    <input type="text" id="audience_val">
                </div>
           `;

            // deploy html into shadow root
            shadowRoot.appendChild(template.content.cloneNode(true));

            // properties
            this._selections = new Array("Zlis","Able","Air","Aris","Zed","Zeka","ZegZeg", "BFS","Bay", "Australia National Bank");
            // stores all names and it's lower case form as key-value
            this._nameMap = new Map();
            for (var i=0; i<this._selections.length; i++){
                this._nameMap.set(this._selections[i], this._selections[i].toLowerCase());
            }
            // click status of dropdown button
            this._status = true;
            // input similarity judgement relevant properties
            this._q = 3;
            this._similarity_threshold = 0.75; 

            // click to display/close the alphabet-chart (overlay)
            this.shadowRoot.getElementById("dropBtn").onclick = e => {
                if (this._status === true){
                    this.shadowRoot.getElementById("overlay").style.display = "block";
                    this.shadowRoot.getElementById("overlay").style.zIndex = "10";
                    this._status = false;
                    console.log(this._status);
                    var e = new Event("onAlphabetShow");
                    this.dispatchEvent(e);
                }else{
                    if (this._status === false){
                        this.shadowRoot.getElementById("overlay").style.display = "none";
                        this.shadowRoot.getElementById("overlay").style.zIndex = "5";
                        this._status = true;
                        console.log(this._status);
                        var e = new Event("onAlphabetHide");
                        this.dispatchEvent(e);
                    }
                } 
            }

            // close the alphabet-chart after select a alphabet and show the alphabet overlay
            this.shadowRoot.getElementById("overlay").onclick = e =>{
                this.shadowRoot.getElementById("alphabet_overlay").style.display = "block";
                this.shadowRoot.getElementById("overlay").style.display = "none";
                var target = e.target;
                this._deploySelections(target.textContent);
                // disable button when alphabet content is displayed or when no name filtred.
                if(this.shadowRoot.getElementById("alphabet_overlay").childElementCount != 0){
                    this.shadowRoot.getElementById("dropBtn").disabled = true;
                }
                this._status = true;
                this.shadowRoot.getElementById("alphabet_overlay").style.zIndex="10";
            }

            // close alphabet overlay and put value into input bar 
            this.shadowRoot.getElementById("alphabet_overlay").onclick = e =>{
                this.shadowRoot.getElementById("alphabet_overlay").style.display = "none";
                this.shadowRoot.getElementById("alphabet_overlay").style.zIndex="1";
                this.shadowRoot.getElementById("dropBtn").disabled = false;
                this._status = true;
                this.shadowRoot.getElementById("cname").value = e.target.textContent;
                this.shadowRoot.getElementById("input_overlay").style.display = "none";
                this.shadowRoot.getElementById("cname").blur(this._inputCheck(this.shadowRoot.getElementById("cname").value));
            }

            // show the input recommendation when input
            // show when input
            this.shadowRoot.getElementById("cname").oninput = e => {
                this.shadowRoot.getElementById("cname").focus();
                // console.log(this.shadowRoot.getElementById("cname").value);
                this.shadowRoot.getElementById("input_overlay").style.display = "block";
                this._inputRecommendation(this.shadowRoot.getElementById("cname").value);
                if(this.shadowRoot.getElementById("overlay").style.display != "none"){
                    this.shadowRoot.getElementById("input_overlay").style.zIndex = "12";
                }
                if(this.shadowRoot.getElementById("alphabet_overlay").style.display != "none"){
                    this.shadowRoot.getElementById("input_overlay").style.zIndex = "12";
                }
                
            }

            this.shadowRoot.getElementById("cname").onchange = e => {
                this.shadowRoot.getElementById("cname").focus();
                // console.log(this.shadowRoot.getElementById("cname").textContent);
                this.shadowRoot.getElementById("input_overlay").style.display = "block";
                this._inputRecommendation(this.shadowRoot.getElementById("cname").value);
                this.shadowRoot.getElementById("input_overlay").style.zIndex = "5";
                this.shadowRoot.getElementById("cname").blur(this._inputCheck(this.shadowRoot.getElementById("cname").value));
            }

            this.shadowRoot.getElementById("cname").onpropertychange = e => {
                this.shadowRoot.getElementById("cname").focus();
                // console.log(this.shadowRoot.getElementById("cname").textContent);
                this.shadowRoot.getElementById("input_overlay").style.display = "block";
                this._inputRecommendation(this.shadowRoot.getElementById("cname").value);
                this.shadowRoot.getElementById("input_overlay").style.zIndex = "5";
                this.shadowRoot.getElementById("cname").blur(this._inputCheck(this.shadowRoot.getElementById("cname").value));
            }
           
            // close input overlay and set input value when click any name in recommendataion
            this.shadowRoot.getElementById("input_overlay").onclick = e =>{
                this.shadowRoot.getElementById("input_overlay").style.display = "none";
                this.shadowRoot.getElementById("cname").value = e.target.textContent;
                this.shadowRoot.getElementById("cname").blur(this._inputCheck(this.shadowRoot.getElementById("cname").value));
            }

            // click "no" button to hide the assisstant part
            this.shadowRoot.getElementById("no").onclick = e =>{
                this.shadowRoot.getElementById("notification").style.display = "none";
            }
            // click "yes" button to show the supplementary filling form
            this.shadowRoot.getElementById("yes").onclick = e =>{
                this.shadowRoot.getElementById("supplementary_form").style.display = "block";
                this.shadowRoot.getElementById("notification").style.display = "none";
                var e = new Event("onSupplementaryShow");
                this.dispatchEvent(e);
            }

            
        }

        /**
         * calculate the similarity of typed customer name, and notify when with higher similarity
         * @param {string} str1
         * @param {string} str2
         * @param {integer} q
         */
        _calcuJaccardCoe(str1,str2,q){
            //spilite two strings
            var splitedStr1 = this._tokenize(str1,q);
            var splitedStr2 = this._tokenize(str2,q);
            // add them together
            var totalSplitedStr = new Array();
            splitedStr1.push.apply(splitedStr1,splitedStr2);
            totalSplitedStr.push.apply(totalSplitedStr,splitedStr1);
            // get the splited str set without redundancy value
            var filtredTotalSplitedStr = new Set(totalSplitedStr);
            // calculate similarity (Jaccard Coefficient)
            return (totalSplitedStr.length - filtredTotalSplitedStr.size) / filtredTotalSplitedStr.size;
        }    

        /**
         * splite string based on q which is the pivot that defines the substring when split
         * @param {string} str 
         * @param {integer} q 
         */
        _tokenize(str, q){
            var splitedStr = new Array();
            if (q === 0){
                var temp = str.split(" ");
                for (var i=0; i<temp.length; i++){
                    splitedStr.push(temp[i]);
                }
            }else{
                for(var i =0; i < str.length - q + 1; i++){
                    splitedStr.push(str.substring(i,i+q));
                }
            }
            return splitedStr;
        }

        /***
         * adds more selections based on data, where can be expaned or closed due to event "onclick".
         */
        importSelections(data){  
            this._selections = data;
        }

        /***
         * get the data of all the customer ids
         */
        getSelections(){
            return this.selections;
        }

        /***
         * close the supplementary form
         */
        closeSupplementary(){
            this.shadowRoot.getElementById("supplementary_form").style.display = "none";
        }

        /***
         * disable the input form when supplementary form shows
         */
        disableInput(){
            this.shadowRoot.getElementById("cname").readonly = true;
        }

        enableInput(){
            this.shadowRoot.getElementById("cname").readonly = false;
        }

        /**
         * deploy customer ids based on alphabet.
         * 1. get the alphabet selection
         * 2. filtrer the selections based on alphabet
         * 3. deploy filtered selection into second stage dropdown snippet
         * @param {string} alphabet
         */
        _deploySelections(alphabet){
            var names = new Array();
            var alphabet_overlay = this.shadowRoot.getElementById("alphabet_overlay");
            var number = alphabet_overlay.childElementCount;
            var i = 0;
            // filtre names
            for (var i=0; i < this._selections.length; i++){
                var customerName = this._selections[i];
                if (customerName.startsWith(alphabet)){
                    names.push(customerName);
                }
            }
            // deploy selected names
            for(i = 0; i < names.length; i++){
                var selected_name = names[i];
                if (number != 0){
                    if (i > number - 1){
                        let customerSnippet = document.createElement("a");
                        customerSnippet.setAttribute('class', 'snippet');
                        customerSnippet.text = selected_name;
                        this.shadowRoot.getElementById("alphabet_overlay").appendChild(customerSnippet);
                    }else{
                        alphabet_overlay.children.item(i).textContent = selected_name;
                    }
                }else{
                    let customerSnippet = document.createElement("a");
                    customerSnippet.setAttribute('class', 'snippet');
                    customerSnippet.text = selected_name;
                    this.shadowRoot.getElementById("alphabet_overlay").appendChild(customerSnippet);
                }
            }
            // remove redundant
            while(i < alphabet_overlay.childElementCount){
                alphabet_overlay.removeChild(alphabet_overlay.children.item(i));
            }
        }

        /***
         * deploy customer ids based on input value in input session
         * 1. get the input value
         * 2. filtres custom names/ids based on user input
         * 3. deploy filtred names into drop down snippet
         * @param {string} input
         */
        _inputRecommendation(input){
            var names = new Array();
            var input_overlay = this.shadowRoot.getElementById("input_overlay");
            var number = input_overlay.childElementCount;
            var i = 0;
            
            // filtre names
            for (var i=0; i < this._selections.length; i++){
                var customerName = this._selections[i];
                var value = this._nameMap.get(customerName);
                if (this._nameMap.get(customerName).includes(input.toLowerCase())){
                    if (input === customerName){
                        continue;
                    }
                    names.push(customerName);
                }                                                                                  
            }

            // deploy selected names
            for(i = 0; i < names.length; i++){
                var selected_name = names[i];
                if (number != 0){
                    if (i > number - 1){
                        let customerSnippet = document.createElement("a");
                        customerSnippet.setAttribute('class', 'snippet');
                        customerSnippet.text = selected_name;
                        this.shadowRoot.getElementById("input_overlay").appendChild(customerSnippet);
                    }else{
                        input_overlay.children.item(i).textContent = selected_name;
                    }
                }else{
                    let customerSnippet = document.createElement("a");
                    customerSnippet.setAttribute('class', 'snippet');
                    customerSnippet.text = selected_name;
                    this.shadowRoot.getElementById("input_overlay").appendChild(customerSnippet);
                }
            }
            // remove redundant
            while(i < input_overlay.childElementCount){
                input_overlay.removeChild(input_overlay.children.item(i));
            }
        }

        /**
         * check whether the current input already exists
         * @param {string} input 
         */
        _inputCheck(input){
            if (input != null || input!= ""){
                if (!this._selections.includes(input)){
                    this.shadowRoot.getElementById("notification").style.display = "block";
                    var event = new Event("onNotificationShow");
                    this.dispatchEvent(event);
                }else if(this._selections.includes(input)){
                    this.shadowRoot.getElementById("notification").style.display = "none";
                    var event = new Event("onNotificationHide");
                    this.dispatchEvent(event);
                    this.shadowRoot.getElementById("value_fillin").style.display = "block";
                }
            }else{
                this.shadowRoot.getElementById("notification").style.display = "none";
            }
        }
    }
    customElements.define("com-sap-martinsdropdownwidget", DropDown);
})();