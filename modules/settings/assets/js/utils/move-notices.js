const NOTICE_SELECTORS = '.wrap .notice, .wrap .updated, .wrap .error';
const TARGET_SELECTOR = '#ea11y-app > div > div + div';
const PLUGIN_SELECTOR = '#ea11y-app';
const MAX_WAIT_ATTEMPTS = 10;
const RETRY_INTERVAL = 100; // ms

/**
 * Move notices from WordPress admin to the React app container.
 *
 * @return {boolean} True if target exists and notices were processed, false otherwise.
 */
function moveNotices() {
	const targetContainer = document.querySelector(TARGET_SELECTOR);

	if (!targetContainer) {
		return false;
	}

	// Find or create a .wrap element inside the target container
	let wrapElement = targetContainer.querySelector('.wrap');
	if (!wrapElement) {
		wrapElement = document.createElement('div');
		wrapElement.className = 'wrap';
		targetContainer.prepend(wrapElement);
	}

	// Find all notices in .wrap containers
	const notices = document.querySelectorAll(NOTICE_SELECTORS);

	notices.forEach((notice) => {
		// Only move notices that are NOT already inside the app
		if (!notice.closest(PLUGIN_SELECTOR)) {
			wrapElement.prepend(notice);
		}
	});

	return true;
}

/**
 * Set up a MutationObserver to watch for dynamically-added notices.
 */
function setupNoticeObserver() {
	const observer = new MutationObserver((mutations) => {
		mutations.forEach((mutation) => {
			mutation.addedNodes.forEach((node) => {
				// Check if the added node is a notice/error/updated element
				if (
					node.nodeType === Node.ELEMENT_NODE &&
					(node.classList.contains('notice') ||
						node.classList.contains('error') ||
						node.classList.contains('updated'))
				) {
					// Check if it's in a .wrap but not in the app
					const isInWrap = node.closest('.wrap');
					const isInApp = node.closest(PLUGIN_SELECTOR);

					if (isInWrap && !isInApp) {
						const targetContainer = document.querySelector(TARGET_SELECTOR);
						if (targetContainer) {
							// Find or create a .wrap element inside the target container
							let wrapElement = targetContainer.querySelector('.wrap');
							if (!wrapElement) {
								wrapElement = document.createElement('div');
								wrapElement.className = 'wrap';
								targetContainer.prepend(wrapElement);
							}
							wrapElement.prepend(node);
						}
					}
				}
			});
		});
	});

	// Observe the entire document body for added notices
	observer.observe(document.body, {
		childList: true,
		subtree: true,
	});

	return observer;
}

/**
 * Wait for the React target element to exist, then move notices.
 *
 * This function polls for the target element with a retry mechanism,
 * since React needs time to render the DOM structure.
 */
function waitAndMoveNotices() {
	// Try moving immediately in case React has already rendered
	if (moveNotices()) {
		setupNoticeObserver();
		return;
	}

	// Set up polling to wait for React to render
	let attempts = 0;
	const interval = setInterval(() => {
		if (moveNotices() || attempts++ >= MAX_WAIT_ATTEMPTS) {
			clearInterval(interval);

			// Only set up observer if we successfully found the target
			if (attempts < MAX_WAIT_ATTEMPTS) {
				setupNoticeObserver();
			}
		}
	}, RETRY_INTERVAL);
}

/**
 * Initialize the notice relocation system.
 *
 * Call this function after React has started rendering to begin
 * moving WordPress admin notices into the React app container.
 */
export function initNoticeRelocation() {
	waitAndMoveNotices();
}
