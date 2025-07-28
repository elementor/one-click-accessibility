import { hexToRGB } from '@ea11y-apps/scanner/utils/convert-colors';

export const getLuminance = (r, g, b) => {
	const toLinear = (c) => {
		const s = c / 255;
		return s <= 0.03928 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4);
	};
	const [lr, lg, lb] = [r, g, b].map(toLinear);
	return 0.2126 * lr + 0.7152 * lg + 0.0722 * lb;
};

export const contrastRatio = (rgb1, rgb2) => {
	const [l1, l2] = [getLuminance(...rgb1), getLuminance(...rgb2)];
	const [lighter, darker] = [Math.max(l1, l2), Math.min(l1, l2)];
	return (lighter + 0.05) / (darker + 0.05);
};

export const isLargeText = (el) => {
	if (!el) {
		return false;
	}
	const { fontSize, fontWeight } = window.getComputedStyle(el);
	const size = parseFloat(fontSize); // px
	const weight = parseInt(fontWeight, 10);
	const isBold = weight >= 700;
	const threshold = isBold ? 18.66 : 24;
	return size >= threshold;
};

export const checkContrastAA = (fgHex, bgHex, el) => {
	const fg = hexToRGB(fgHex);
	const bg = hexToRGB(bgHex);
	const ratio = contrastRatio(fg, bg);
	const large = isLargeText(el);
	const passesAA = ratio >= (large ? 3 : 4.5);
	return {
		ratio: +ratio.toFixed(2),
		largeText: large,
		passesAA,
	};
};
