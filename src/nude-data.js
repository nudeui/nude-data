import stringify from "./stringify.js";
import codeStringifiers from "./stringifiers/code.js";

export default class DataTree extends HTMLElement {
	constructor() {
		super();
		this.attachShadow({mode: "open"});
		this.shadowRoot.innerHTML = `
			<link href="${ new URL("./nude-data.css", import.meta.url) }" rel="stylesheet" />
			<div id="data-tree"></div>
		`;

		this.dom = {container: this.shadowRoot.querySelector("#data-tree")};
	}

	connectedCallback () {
		if (this.hasAttribute("src")) {
			fetch(this.getAttribute("src"))
				.then(response => response.text())
				.then(text => {
					this.renderText(text);
				})
				.catch(error => {
					this.data = undefined;
					this.error = error;
				});
		}

		if (this.textContent && this.data === undefined) {
			this.renderText(this.textContent);
		}

		if (this.hasAttribute("selectable")) {
			this.dom.container.addEventListener("click", this);
		}
	}

	disconnectedCallback () {
		this.dom.container.removeEventListener("click", this);
	}

	handleEvent (event) {
		if (event.type === "click") {
			if (!event.target.matches || event.target.matches("summary, summary *")) {
				return;
			}
			let selectable = this.getAttribute("selectable").split(/,?\s+/);
			let selectableSelector = selectable.map(s => `[part~="${s}"]`).join(", ");
			selectableSelector = selectableSelector ? `:is(${ selectableSelector })` : "";
			let selector = "[part~=value]" + selectableSelector;

			for (let el of this.dom.container.querySelectorAll("[part~=selected]")) {
				el.part.remove("selected");
			}

			event.target.closest(selector)?.part.add("selected");
		}
	}

	renderText (text) {
		this.data = this.constructor.parse(text);
		this.render(this.data);
	}

	render (tree) {
		let lang = this.closest("[lang]")?.lang;
		let stringifiers = this.matches("[type=code]") ? codeStringifiers : undefined;
		this.dom.container.innerHTML = stringify(tree, {lang, stringifiers});
	}

	static parse (value) {
		if (typeof value !== "string") {
			// Already parsed
			return value;
		}

		try {
			return JSON.parse(value);
		}
		catch (error) {
			let data;
			eval("data = " + value);
			return data;
		}
	}
}

customElements.define("nude-data", DataTree);

