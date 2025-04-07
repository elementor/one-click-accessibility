export const closeWidget = (widget) => {
	widget.remove();
	document.body.style.removeProperty('margin-right');
};
