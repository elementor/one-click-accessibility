document.addEventListener('DOMContentLoaded', () => {
	const customLinks = document.querySelectorAll('.ally-widget-trigger');

	customLinks.forEach((link) => {
		link.addEventListener('click', () => {
			if (window?.ea11yWidget?.widget?.open) {
				return window.ea11yWidget.widget.isOpen()
					? window.ea11yWidget.widget.close()
					: window.ea11yWidget.widget.open();
			}
		});
	});
});
