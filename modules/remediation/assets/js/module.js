import { AttributeRemediation } from './actions/attribute';
import { ElementRemediation } from './actions/element';
import { ReplaceRemediation } from './actions/replace';
import { StylesRemediation } from './actions/styles';

class RemediationRunner {
	constructor(remediations) {
		this.remediations = remediations;
		this.classMap = {
			attribute: AttributeRemediation,
			element: ElementRemediation,
			replace: ReplaceRemediation,
			styles: StylesRemediation,
			global: ReplaceRemediation,
		};
		this.checkTimeout = null;

		this.runAll();
	}

	runAll() {
		// Use filter to remove remediations that were run
		this.remediations = this.remediations.filter((rem) => {
			return !this.runRemediation(rem);
		});
	}

	runRemediation(remediation) {
		const type = (
			remediation.global === '1' ? 'global' : remediation.type
		).toLowerCase();
		const Handler = this.classMap[type];

		if (Handler) {
			try {
				return new Handler(document, remediation).run();
			} catch (e) {
				if (window.AllyRemediations?.debug && window.AllyRemediations.debug) {
					console.error('Remediation failed', e, remediation);
				}
			}
		}
		return false;
	}

	// Check if any remaining remediations can now be applied
	checkRemediations() {
		if (!this.isComplete()) {
			this.runAll();
		}
	}

	// Check if all remediations are complete
	isComplete() {
		return this.remediations.length === 0;
	}
}

// Only run if AllyRemediations is present and has remediations
if (
	window?.AllyRemediations &&
	Array.isArray(window.AllyRemediations?.remediations)
) {
	let remediationRunner = null;
	let mutationObserver = null;
	let isInitialized = false;

	// Function to initialize remediations
	function initializeRemediations() {
		// Prevent multiple initializations
		if (isInitialized) {
			remediationRunner.runAll();
			return;
		}

		isInitialized = true;

		remediationRunner = new RemediationRunner(
			window.AllyRemediations.remediations,
		);

		// Set up MutationObserver to watch for DOM changes
		if (window.MutationObserver && remediationRunner.remediations.length > 0) {
			mutationObserver = new MutationObserver((mutations) => {
				let shouldCheck = false;

				// Check if any mutations added nodes
				for (const mutation of mutations) {
					if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
						shouldCheck = true;
						break;
					}
				}

				// If nodes were added and we still have remediations to apply, check them
				if (shouldCheck) {
					// Debounce the check to avoid excessive calls
					clearTimeout(remediationRunner.checkTimeout);
					remediationRunner.checkTimeout = setTimeout(() => {
						remediationRunner.checkRemediations();

						// Disconnect observer if all remediations are complete
						if (remediationRunner.isComplete() && mutationObserver) {
							mutationObserver.disconnect();
							mutationObserver = null;
						}
					}, 100);
				}
			});

			// Start observing
			mutationObserver.observe(document.body, {
				childList: true,
				subtree: true,
			});
		}
	}

	// Run on DOMContentLoaded with timeout
	window.addEventListener('DOMContentLoaded', function () {
		setTimeout(() => {
			initializeRemediations();
		}, 400);
	});

	// Also run immediately if DOM is already loaded
	if (document.readyState !== 'loading') {
		// DOM is already loaded, run immediately
		setTimeout(() => {
			initializeRemediations();
		}, 400);
	}
}
