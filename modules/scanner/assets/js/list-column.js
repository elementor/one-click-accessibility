/**
 * Accessibility List Column Enhancement
 * Handles responsive button text and CSS tooltips based on available column space
 */

class EA11yListColumn {
	constructor() {
		this.init();
	}

	init() {
		// Wait for DOM to be ready
		if (document.readyState === 'loading') {
			document.addEventListener('DOMContentLoaded', () =>
				this.setupEnhancements(),
			);
		} else {
			this.setupEnhancements();
		}

		// Also recheck after a short delay to handle CSS timing issues
		setTimeout(() => {
			this.setupEnhancements();
		}, 500);
	}

	setupEnhancements() {
		this.buttons = document.querySelectorAll('.ea11y-accessibility-button');
		this.columnTitles = document.querySelectorAll('.ea11y-column-title');

		if (this.buttons.length === 0) {
			return;
		}

		this.setupResponsiveButtons();
		this.setupResponsiveColumnTitles();
		this.setupResizeObserver();
		this.setupWindowResize();
	}

	setupWindowResize() {
		// Add window resize listener as additional fallback
		let resizeTimeout;
		window.addEventListener('resize', () => {
			clearTimeout(resizeTimeout);
			resizeTimeout = setTimeout(() => {
				this.setupResponsiveButtons();
				this.setupResponsiveColumnTitles();
			}, 100);
		});
	}

	setupResponsiveButtons() {
		this.buttons.forEach((button) => {
			this.updateButton(button);
		});
	}

	setupResponsiveColumnTitles() {
		this.columnTitles.forEach((title) => {
			this.updateColumnTitle(title);
		});
	}

	updateButton(button) {
		const column = button.closest('td');
		if (!column) {
			return;
		}

		// Use actual column width to determine behavior
		const columnWidth = column.offsetWidth;
		const textSpan = button.querySelector('.ea11y-button-text');
		if (!textSpan) {
			return;
		}

		const fullText = button.dataset.fullText;
		const shortText = button.dataset.shortText;

		// Threshold for switching to compact mode (can be adjusted)
		const compactThreshold = 100;

		if (columnWidth < compactThreshold) {
			// Narrow column: short text, smaller min-width, show tooltip
			textSpan.textContent = shortText;
			button.style.minWidth = '50px';
			button.classList.remove('ea11y-tooltip-hidden');
		} else {
			// Wide column: full text, larger min-width, hide tooltip
			textSpan.textContent = fullText;
			button.style.minWidth = '80px';
			button.classList.add('ea11y-tooltip-hidden');
		}
	}

	updateColumnTitle(title) {
		const column = title.closest('th');
		if (!column) {
			return;
		}

		const titleAnchor = title.parentElement.querySelector('a');
		if (!titleAnchor) {
			return;
		}

		// Use actual column width to determine behavior
		const columnWidth = column.offsetWidth;

		// Threshold for hiding title and showing tooltip
		const hideThreshold = 100;

		if (columnWidth < hideThreshold) {
			title.style.display = 'none';
			titleAnchor.classList.remove('ea11y-tooltip-hidden');
		} else {
			title.style.display = '';
			titleAnchor.classList.add('ea11y-tooltip-hidden');
		}
	}

	setupResizeObserver() {
		// Use ResizeObserver to detect column width changes
		if (window.ResizeObserver) {
			const resizeObserver = new ResizeObserver((entries) => {
				entries.forEach((entry) => {
					const column = entry.target;

					// Handle button updates
					const button = column.querySelector('.ea11y-accessibility-button');
					if (button) {
						this.updateButton(button);
					}

					// Handle column title updates
					const title = column.querySelector('.ea11y-column-title');
					if (title) {
						this.updateColumnTitle(title);
					}
				});
			});

			// Observe all columns containing our buttons
			this.buttons.forEach((button) => {
				const column = button.closest('td');
				if (column) {
					resizeObserver.observe(column);
				}
			});

			// Observe all header columns containing our titles
			this.columnTitles.forEach((title) => {
				const headerColumn = title.closest('th');
				if (headerColumn) {
					resizeObserver.observe(headerColumn);
				}
			});
		} else {
			// Fallback for older browsers
			let resizeTimeout;
			window.addEventListener('resize', () => {
				clearTimeout(resizeTimeout);
				resizeTimeout = setTimeout(() => {
					this.setupResponsiveButtons();
					this.setupResponsiveColumnTitles();
				}, 250);
			});
		}
	}
}

// Initialize when script loads
new EA11yListColumn();
