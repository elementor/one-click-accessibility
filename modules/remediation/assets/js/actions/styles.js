import { RemediationBase } from './base';

export class StylesRemediation extends RemediationBase {
	constructor(dom, data) {
		super(dom, data);

		this.maybeAddStyleTag();
	}

	maybeAddStyleTag() {
		let node = this.dom.querySelector('style#ea11y-remediation-styles');

		if (!node) {
			node = this.dom.createElement('style');
			node.id = 'ea11y-remediation-styles';

			this.dom.body.appendChild(node);
		}
	}

	getStyleTag() {
		return this.dom.querySelector('style#ea11y-remediation-styles');
	}

	run() {
		const tag = this.getStyleTag();

		if (!tag) {
			return false;
		}

		tag.innerText += this.data.rule;

		return true;
	}
}
