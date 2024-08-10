import { isPlainObject } from "./util.js";
import stringifiers from "./stringifiers/human.js";

export default function stringify (value, o = {}) {
	o.cache ??= new WeakSet();
	o.depth ??= 1;
	o.path ??= [];
	o.stringifiers ??= stringifiers;

	if (value && typeof value === "object") {
		if (o.cache.has(value)) {
			return o.stringifiers.circular(value);
		}

		o.cache.add(value);

		if (Array.isArray(value) || value instanceof Set) {
			return o.stringifiers.list(value, o);
		}
		else if (isPlainObject(value) || value instanceof Map) {
			return o.stringifiers.object(value, o);
		}
	}

	return o.stringifiers.leaf(value, o);
}