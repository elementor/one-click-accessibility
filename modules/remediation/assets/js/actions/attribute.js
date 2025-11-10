import { Actions } from '../enum/actions';
import { RemediationBase } from './base';

export class AttributeRemediation extends RemediationBase {
	run() {
		const {
			xpath: originXpath,
			action,
			attribute_name: attributeName,
			attribute_value: attributeValue,
			global: isGlobal,
		} = this.data;

		const xpath = originXpath.replace('svg', "*[name()='svg']");
		const el =
			isGlobal === '1'
				? this.getElementByXPathFallbackSnippet(find, xpath)
				: this.getElementByXPath(xpath);
		if (!el) {
			return false;
		}

		switch (action) {
			case Actions.add:
			case Actions.update:
				el.setAttribute(attributeName, attributeValue);
				// Disable duplicates attr for image
				const exclusions = { alt: ['role', 'title'], role: ['alt', 'title'] };
				if (exclusions[attributeName]) {
					exclusions[attributeName].forEach((attr) => el.removeAttribute(attr));
				}
				break;
			case Actions.remove:
				el.removeAttribute(attributeName);
				break;
			case Actions.clear:
				el.setAttribute(attributeName, '');
				break;
		}

		return true;
	}
}
