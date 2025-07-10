export class RemediationBase {
	constructor(dom, data) {
		this.dom = dom;
		this.data = data;
	}
	run() {
		throw new Error(`Action type '${this.data.type}' - not implemented`);
	}

	getElementByXPath(xpath) {
		return this.dom.evaluate(
			xpath,
			this.dom,
			null,
			XPathResult.FIRST_ORDERED_NODE_TYPE,
			null,
		).singleNodeValue;
	}

	createElement(tag, attributes = [], content = '') {
		const element = document.createElement(tag);
		attributes.forEach((attr) => {
			element.setAttribute(attr.name, attr.value);
		});
		if (content) {
			element.textContent = content;
		}
		return element;
	}
}
