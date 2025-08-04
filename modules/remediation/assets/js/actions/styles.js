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

	excludeAdminBar() {
		const adminBar = this.dom.querySelector('div#wpadminbar');
		if (!adminBar) {
			return this.data.rule;
		}
		const replacement = window.ea11yScannerData ? 'div' : 'div:nth-of-type(2)';

		return this.data.rule.replaceAll(
			'html:first-of-type > body:first-of-type > div:first-of-type',
			`html:first-of-type > body:first-of-type > ${replacement}`,
		);
	}

	run() {
		const tag = this.getStyleTag();

		if (!tag) {
			return false;
		}

		const rule = this.excludeAdminBar();
		tag.innerText += rule;

		return true;
	}
}
