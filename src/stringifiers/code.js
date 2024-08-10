import { getType } from "../util.js";
import stringify from "../stringify.js";

export default {
	leaf (value, o) {
		let type = getType(value).toLowerCase();
		let classes = ["leaf", "value", type];
		let subtype = type === "object" ? Object.getPrototypeOf(value).constructor.name : "";
		let tag = "data";
		let valueAttribute;

		if (subtype) {
			classes.push(subtype);
		}

		if (type === "date") {
			value = value.toISOString();
			tag = "time";
			valueAttribute = "datetime";
		}
		else if (type === "boolean" || type === "null" || type === "undefined") {
			valueAttribute = "value";
		}
		else if (type === "number") {
			if (Number.isNaN(value)) {
				classes.push("nan")
			}
		}

		return `<${tag} part="${ classes.join(" ") }"${ valueAttribute ? `${valueAttribute}="${ value }"` : "" }>${ value }</${tag}>`;
	},

	keyValue (value, o) {
		return `
		<dt part="property">${ o.key }</dt>
		<dd>${ stringify(value, o) }</dd>`;
	},

	list (list, o) {
		let type = getType(list).toLowerCase();
		let array = Array.isArray(list) ? list : [...list];
		let depth = o.path.length;
		o = {...o, parent: list};

		return `<details part="list ${ type }"${ depth > 3 ? "" : " open"} data-depth="${ depth }">
		<summary>
			<span part="items meta">${ array.length }</span>
		</summary>
		<ol part="array value">${ array.map((item, i) => `<li>${ stringify(item, {...o, key: i, path: [...o.path, i] }) }</li>`).join("\n")}</ol>
		</details>`;
	},

	object (object, o) {
		let type = getType(object).toLowerCase();
		let entries = object instanceof Map ? [...object.entries()] : Object.entries(object);
		let depth = o.path.length;
		o = {...o, parent: object};

		return `
		<details part="value object ${ type }"${ depth > 3 ? "" : " open"} data-depth="${ depth }">
		<summary>
			<span part="properties meta">${ Object.keys(object).join(", ") }</span>
		</summary>
		<dl part="object">${ entries.map(([key, value]) => this.keyValue(value, {...o, key, path: [...o.path, key] })).join("\n") }</dl>
		</details>`;
	},

	circular (value) {
		// TODO point to the original value
		return `<span part="circular value leaf">(Circular)</span>`;
	},
}