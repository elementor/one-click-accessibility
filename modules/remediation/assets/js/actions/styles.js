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

	isValidCSS(cssText) {
		try {
			// Basic checks for common malicious patterns
			if (!cssText || typeof cssText !== 'string') {
				return false;
			}

			// Check for basic CSS structure and disallow dangerous patterns
			const dangerousPatterns = [
				/@import/i,
				/javascript:/i,
				/expression\s*\(/i,
				/behavior\s*:/i,
				/binding\s*:/i,
				/-moz-binding/i,
			];

			if (dangerousPatterns.some((pattern) => pattern.test(cssText))) {
				return false;
			}

			// More comprehensive CSS structure validation
			const cssRegex = /^[\s\S]*\{\s*[\s\S]+:\s*[\s\S]+;\s*\}[\s\S]*$/;
			return cssRegex.test(cssText.replace(/\s+/g, ' ').trim());
		} catch (e) {
			return false;
		}
	}

	excludeAdminBar() {
		const adminBar = this.dom.querySelector('div#wpadminbar');
		const expectedSelector =
			'html:first-of-type > body:first-of-type > div:first-of-type';

		if (!adminBar || !this.data.rule.includes(expectedSelector)) {
			return this.data.rule;
		}

		return this.data.rule.replaceAll(
			expectedSelector,
			`html:first-of-type > body:first-of-type > div`,
		);
	}

	run() {
		const tag = this.getStyleTag();

		if (!tag) {
			return false;
		}

		const rule = this.excludeAdminBar();
		if (this.isValidCSS(rule)) {
			tag.innerText += rule;
		}
		return true;
	}
}
