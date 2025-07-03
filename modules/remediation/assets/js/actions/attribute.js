import { Actions } from '../enum/actions';
import { RemediationBase } from './base';

export class AttributeRemediation extends RemediationBase {
	run() {
		const {
			xpath: originXpath,
			action,
			attribute_name: attributeName,
			attribute_value: attributeValue,
		} = this.data;

		const xpath = originXpath.replace('svg', "*[name()='svg']");
		const el = this.getElementByXPath(xpath);
		if (!el) {
			return false;
		}

		switch (action) {
			case Actions.add:
			case Actions.update:
				el.setAttribute(attributeName, attributeValue);
				// Disable duplicates attr for image
				const exclusions = { alt: 'role', role: 'alt' };
				if (exclusions[attributeName]) {
					el.removeAttribute(exclusions[attributeName]);
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
