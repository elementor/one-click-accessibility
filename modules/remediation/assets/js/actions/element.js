import { Actions } from '../enum/actions';
import { RemediationBase } from './base';

export class ElementRemediation extends RemediationBase {
	run() {
		const { xpath, action, content, child } = this.data;
		const el = this.getElementByXPath(xpath);
		if (!el) {
			return false;
		}
		let childEl = null;
		if (child) {
			try {
				childEl = this.createElement(
					child.tag,
					child.attributes || [],
					child.content || '',
				);
			} catch (e) {
				return;
			}
		}
		switch (action) {
			case Actions.update:
				el.nodeValue = content;
				break;
			case Actions.remove:
				el.remove();
				break;
			case Actions.addChild:
				if (childEl) {
					el.appendChild(childEl);
				}
				break;
			case Actions.removeChild:
				if (childEl) {
					el.removeChild(childEl);
				}
				break;
			case Actions.addBefore:
				if (childEl && el.parentNode) {
					el.parentNode.insertBefore(childEl, el);
				}
				break;
			case Actions.addAfter:
				if (childEl && el.parentNode) {
					el.parentNode.insertBefore(childEl, el.nextSibling);
				}
				break;
		}

		return true;
	}
}
