export class RemediationBase {
	constructor(dom, data) {
		this.dom = dom;
		this.data = data;
	}
	run() {
		throw new Error(`Action type '${this.data.type}' - not implemented`);
	}

	incrementBodyDivIndex(xpath) {
		const regex = /(\/body\[\d+\]\/div\[)(\d+)/;
		if (xpath.match(regex)) {
			return xpath.replace(regex, (match, prefix, x) => {
				const currentNum = parseInt(x, 10);
				const nextNum = currentNum + 1;

				return `${prefix}${nextNum}`;
			});
		}

		return xpath;
	}

	getElementByXPath(originXpath) {
		let xpath = originXpath.replace('svg', "*[name()='svg']");
		const isNavbarExist = document.getElementById('wpadminbar');
		if (isNavbarExist) {
			xpath = this.incrementBodyDivIndex(xpath);
		}
		return this.dom.evaluate(
			xpath,
			this.dom,
			null,
			XPathResult.FIRST_ORDERED_NODE_TYPE,
			null,
		).singleNodeValue;
	}

	getElementByXPathFallbackSnippet(snippet, xpath = null) {
		// Try XPath first
		if (xpath) {
			const element = this.getElementByXPath(xpath);
			if (element) {
				// Pick the one whose outerHTML best matches the snippet
				const normalizedSnippet = snippet
					.replace(/\s+/g, ' ')
					.trim()
					.toLowerCase();
				const html = element.outerHTML
					.replace(/\s+/g, ' ')
					.trim()
					.toLowerCase();
				if (html.includes(normalizedSnippet)) {
					return element;
				}
			}
		}

		const parser = new DOMParser();
		const doc = parser.parseFromString(snippet.trim(), 'text/html');
		const parsed = doc.body.firstElementChild;
		if (!parsed) {
			return null;
		}

		const selectorParts = [parsed.tagName.toLowerCase()];

		// Add id and class if present
		if (parsed.id) {
			selectorParts.push(`#${parsed.id}`);
		}
		if (parsed.classList.length) {
			selectorParts.push(`.${Array.from(parsed.classList).join('.')}`);
		}

		const selector = selectorParts.join('');

		// Try to find it in the document
		return document.querySelector(selector);
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
