export const expandHex = (hex) => {
	hex = hex.replace(/^#/, '');
	if (hex.length === 3) {
		hex = hex
			.split('')
			.map((c) => c + c)
			.join('');
	}
	return `#${hex}`;
};

export const hexToHsl = (hex) => {
	hex = expandHex(hex).replace(/^#/, '');

	// Handle optional alpha (default 255)
	const hasAlpha = hex.length === 8;
	const r = parseInt(hex.slice(0, 2), 16) / 255;
	const g = parseInt(hex.slice(2, 4), 16) / 255;
	const b = parseInt(hex.slice(4, 6), 16) / 255;
	const a = hasAlpha ? parseInt(hex.slice(6, 8), 16) / 255 : 1;

	const max = Math.max(r, g, b);
	const min = Math.min(r, g, b);
	let h, s;
	const l = (max + min) / 2;

	if (max === min) {
		h = s = 0;
	} else {
		const d = max - min;
		s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
		switch (max) {
			case r:
				h = (g - b) / d + (g < b ? 6 : 0);
				break;
			case g:
				h = (b - r) / d + 2;
				break;
			case b:
				h = (r - g) / d + 4;
				break;
		}
		h *= 60;
	}

	return {
		h: Math.round(h),
		s: Math.round(s * 100),
		l: Math.round(l * 100),
		a: parseFloat(a.toFixed(2)), // keep 2 decimal alpha
	};
};

export const hslToHex = ({ h, s, l, a = 1 }) => {
	s /= 100;
	l /= 100;

	const c = (1 - Math.abs(2 * l - 1)) * s;
	const x = c * (1 - Math.abs(((h / 60) % 2) - 1));
	const m = l - c / 2;

	let r, g, b;
	if (h < 60) {
		[r, g, b] = [c, x, 0];
	} else if (h < 120) {
		[r, g, b] = [x, c, 0];
	} else if (h < 180) {
		[r, g, b] = [0, c, x];
	} else if (h < 240) {
		[r, g, b] = [0, x, c];
	} else if (h < 300) {
		[r, g, b] = [x, 0, c];
	} else {
		[r, g, b] = [c, 0, x];
	}

	const toHex = (v) =>
		Math.round((v + m) * 255)
			.toString(16)
			.padStart(2, '0');

	const alphaHex = Math.round(a * 255)
		.toString(16)
		.padStart(2, '0');

	return a < 1
		? `#${toHex(r)}${toHex(g)}${toHex(b)}${alphaHex}`.toUpperCase()
		: `#${toHex(r)}${toHex(g)}${toHex(b)}`.toUpperCase();
};
