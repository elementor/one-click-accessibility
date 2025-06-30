import { AttributeRemediation } from './actions/attribute';
import { ElementRemediation } from './actions/element';
import { ReplaceRemediation } from './actions/replace';

class RemediationRunner {
	constructor(remediations) {
		this.remediations = remediations;
		this.classMap = {
			attribute: AttributeRemediation,
			element: ElementRemediation,
			replace: ReplaceRemediation,
		};
		this.runAll();
	}

	runAll() {
		this.remediations.forEach((rem) => {
			const type = (rem.type || '').toLowerCase();
			const Handler = this.classMap[type];
			if (Handler) {
				try {
					new Handler(document, rem).run();
				} catch (e) {
					if (window.AllyRemediations?.debug && window.AllyRemediations.debug) {
						console.error('Remediation failed', e, rem);
					}
				}
			}
		});
	}
}

// Only run if AllyRemediations is present and has remediations
if (
	window?.AllyRemediations &&
	Array.isArray(window.AllyRemediations?.remediations)
) {
	window.addEventListener('DOMContentLoaded', function () {
		setTimeout(() => {
			new RemediationRunner(window.AllyRemediations.remediations);
		}, 400);
	});
}
