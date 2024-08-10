export function isPlainObject (o) {
	return getType(o) === "Object"
	    && Object.getPrototypeOf(o).constructor?.name === "Object";
}

export function getType (value) {
	return Object.prototype.toString.call(value).slice(8, -1);
}