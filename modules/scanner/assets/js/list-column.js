/**
 * Accessibility List Column Enhancement
 * Handles responsive button text and enhanced tooltips
 */

class EA11yListColumn {
	constructor() {
		this.currentTooltip = null;
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
	}

	setupEnhancements() {
		this.buttons = document.querySelectorAll('.ea11y-accessibility-button');
		this.columnTitles = document.querySelectorAll('.ea11y-column-title');

		if (this.buttons.length === 0) return;

		this.setupResponsiveText();
		this.setupResponsiveColumnTitles();
		this.setupTooltipsWithDelegation();
		this.setupResizeObserver();
	}

	setupResponsiveText() {
		this.buttons.forEach((button) => {
			this.updateButtonText(button);
		});
	}

	setupResponsiveColumnTitles() {
		this.columnTitles.forEach((title) => {
			this.updateColumnTitle(title);
		});
	}

	updateButtonText(button) {
		const column = button.closest('td');
		if (!column) return;

		const columnWidth = column.offsetWidth;
		const textSpan = button.querySelector('.ea11y-button-text');
		if (!textSpan) return;

		const fullText = button.dataset.fullText;
		const shortText = button.dataset.shortText;

		if (columnWidth < 80) {
			// Narrow column: short text and smaller min-width
			textSpan.textContent = shortText;
			button.style.minWidth = '50px';
		} else {
			// Wide column: full text and larger min-width
			textSpan.textContent = fullText;
			button.style.minWidth = '80px';
		}
	}

	updateColumnTitle(title) {
		const column = title.closest('th');
		if (!column) return;

		const columnWidth = column.offsetWidth;

		if (columnWidth < 80) {
			title.style.display = 'none';
		} else {
			title.style.display = '';
		}
	}

	setupTooltipsWithDelegation() {
		// Remove any existing tooltips first
		this.removeAllTooltips();

		// Use event delegation on document body
		document.body.addEventListener(
			'mouseenter',
			this.handleMouseEnter.bind(this),
			true,
		);
		document.body.addEventListener(
			'mouseleave',
			this.handleMouseLeave.bind(this),
			true,
		);
		document.body.addEventListener('focus', this.handleFocus.bind(this), true);
		document.body.addEventListener('blur', this.handleBlur.bind(this), true);
	}

	handleMouseEnter(event) {
		const button = event.target.closest('.ea11y-accessibility-button');
		if (!button) return;

		this.showTooltip(button);
	}

	handleMouseLeave(event) {
		const button = event.target.closest('.ea11y-accessibility-button');
		if (!button) return;

		this.hideTooltip();
	}

	handleFocus(event) {
		const button = event.target.closest('.ea11y-accessibility-button');
		if (!button) return;

		this.showTooltip(button);
	}

	handleBlur(event) {
		const button = event.target.closest('.ea11y-accessibility-button');
		if (!button) return;

		this.hideTooltip();
	}

	showTooltip(button) {
		const tooltipText = button.dataset.tooltip;
		if (!tooltipText) return;

		// Check column width - only show tooltip if column is narrow
		const column = button.closest('td');
		if (!column) return;

		const columnWidth = column.offsetWidth;
		if (columnWidth >= 80) {
			// Column is wide enough to show full text, no tooltip needed
			return;
		}

		// Remove any existing tooltip
		this.hideTooltip();

		// Create new tooltip
		const tooltip = document.createElement('div');
		tooltip.className = 'ea11y-tooltip ea11y-tooltip-show';
		tooltip.textContent = tooltipText;
		tooltip.setAttribute('role', 'tooltip');

		// Add to body
		document.body.appendChild(tooltip);

		// Position tooltip
		this.positionTooltip(tooltip, button);

		// Store reference
		this.currentTooltip = tooltip;
	}

	hideTooltip() {
		if (this.currentTooltip) {
			this.currentTooltip.remove();
			this.currentTooltip = null;
		}
	}

	removeAllTooltips() {
		const tooltips = document.querySelectorAll('.ea11y-tooltip');
		tooltips.forEach((tooltip) => tooltip.remove());
		this.currentTooltip = null;
	}

	positionTooltip(tooltip, button) {
		const buttonRect = button.getBoundingClientRect();
		const tooltipRect = tooltip.getBoundingClientRect();

		const gap = 8; // Fixed gap between button and tooltip

		// Center horizontally relative to button (viewport coordinates)
		const left = buttonRect.left + (buttonRect.width - tooltipRect.width) / 2;

		// Try to show above button first (viewport coordinates)
		const topPosition = buttonRect.top - tooltipRect.height - gap;
		const bottomPosition = buttonRect.bottom + gap;

		// Check if there's enough space above (viewport coordinates)
		const hasSpaceAbove = topPosition >= 10;

		// Position above or below based on available space
		const top = hasSpaceAbove ? topPosition : bottomPosition;

		// Apply position
		tooltip.style.left = Math.round(left) + 'px';
		tooltip.style.top = Math.round(top) + 'px';
	}

	setupResizeObserver() {
		// Use ResizeObserver to detect column width changes
		if (window.ResizeObserver) {
			const resizeObserver = new ResizeObserver((entries) => {
				entries.forEach((entry) => {
					const column = entry.target;

					// Handle button text updates
					const button = column.querySelector('.ea11y-accessibility-button');
					if (button) {
						this.updateButtonText(button);
					}

					// Handle column title updates
					const title = column.querySelector('.ea11y-column-title');
					if (title) {
						//this.updateColumnTitle(title);
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
					this.setupResponsiveText();
					this.setupResponsiveColumnTitles();
				}, 250);
			});
		}
	}
}

// Initialize when script loads
new EA11yListColumn();

// End of file
