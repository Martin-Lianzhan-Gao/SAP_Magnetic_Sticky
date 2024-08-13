(function()  { // using the self-executing JS function
	let template = document.createElement("template"); // can't be redeclared, a code block can declare one variable by using "let"
	template.innerHTML = ` // create a html element
		<form id="form">
			<fieldset>
				<legend>Drop Down Properties</legend>
				<table>
					<tr>
						<td>Color</td>
						<td><input id="styling_height" type="text" size="40" maxlength="40"></td>
					</tr>
				</table>
				<input type="submit" style="display:none;">
			</fieldset>
		</form>
	`;
    // construct an autonomous custom elements
	class ColoredBoxStylingPanel extends HTMLElement { // any autonomous cutom element always extends HTMLElement, here, prevent submit to server.
		constructor() {
			super(); // always call super()
			this._shadowRoot = this.attachShadow({mode: "open"}); // create a shadow root
			this._shadowRoot.appendChild(template.content.cloneNode(true)); // clone template and add it as the child
			this._shadowRoot.getElementById("form").addEventListener("submit", this._submit.bind(this));
		}

		_submit(e) {
			e.preventDefault(); // cancel the event if it is cancelable, means the default action that belongs to the event will not occur.
			this.dispatchEvent(new CustomEvent("propertiesChanged", {
					detail: { // dispatch a new custom event that make "e" become this.color
						properties: {
							height: this.height
						}
					}
			}));
		}

		set height(newHeight) {
			this._shadowRoot.getElementById("styling_height").value = newHeight;
		}

		get height() {
			return this._shadowRoot.getElementById("styling_height").value;
		}
	}

customElements.define("com-sap-sample-coloredbox-styling", ColoredBoxStylingPanel);})();