export const isRtl = () =>
	getComputedStyle(document.documentElement).direction === 'rtl';
