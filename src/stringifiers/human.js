import { getType } from "../util.js";
import codeStringifiers from "./code.js";

export default Object.assign({}, codeStringifiers, {
	leaf (value, o) {
		let type = getType(value).toLowerCase();
		let classes = ["leaf", "value", type];
		let subtype = type === "object" ? Object.getPrototypeOf(value).constructor.name : "";
		let tag = "data";
		let valueAttribute = "value";
		let content = value;

		if (subtype) {
			classes.push(subtype);
		}

		if (type === "date") {
			content = value.toLocaleString(o.lang ?? "en", o.dateFormat ?? {dateStyle: "long", timeStyle: "short"});
			value = value.toISOString();
			tag = "time";
			valueAttribute = "datetime";
		}
		else if (type === "boolean" || type === "null" || type === "undefined") {
			content = "";
		}
		else if (type === "number") {
			if (Number.isNaN(value)) {
				content = "";
				classes.push("nan")
			}
			else {
				content = value.toLocaleString(o.lang ?? "en");
			}
		}

		return `<${tag} part="${ classes.join(" ") }"${ content !== value ? `${valueAttribute}="${ value }"` : "" }>${ content }</${tag}>`;
	},
});