import postcss from 'postcss';

export const isValidCSS = (cssText) => {
	try {
		// Basic checks for common malicious patterns
		if (!cssText || typeof cssText !== 'string') {
			return false;
		}
		postcss.parse(cssText);
		return true;
	} catch (e) {
		return false;
	}
};

export const rgbOrRgbaToHex = (color) => {
	const match = color.match(
		/rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*([\d.]+))?\)/i,
	);
	if (!match) {
		return null;
	} // Not an RGB or RGBA string

	const r = parseInt(match[1]).toString(16).padStart(2, '0');
	const g = parseInt(match[2]).toString(16).padStart(2, '0');
	const b = parseInt(match[3]).toString(16).padStart(2, '0');

	// If alpha present and less than 1, include it
	if (match[4] !== undefined && parseFloat(match[4]) < 1) {
		const a = Math.round(parseFloat(match[4]) * 255)
			.toString(16)
			.padStart(2, '0');
		return `#${r}${g}${b}${a}`.toUpperCase(); // 8-digit hex with alpha
	}

	return `#${r}${g}${b}`.toUpperCase(); // 6-digit hex
};

export const getDataFromCss = (cssRules) => {
	const result = { color: null, background: null };

	const ruleMatches = cssRules.matchAll(/([^{]+)\s*\{([^}]+)\}/g);

	for (const [, selector, declarations] of ruleMatches) {
		let element;
		try {
			element = document.querySelector(selector.trim());
		} catch {
			continue; // Skip invalid selectors
		}

		if (!element) {
			continue;
		}

		const colorMatch = declarations.match(
			/(?<!background-)color\s*:\s*([^;!]+)/i,
		);
		const bgMatch = declarations.match(/background-color\s*:\s*([^;!]+)/i);

		const colorValue = colorMatch ? colorMatch[1].trim() : null;
		const bgValue = bgMatch ? bgMatch[1].trim() : null;

		// Store values when explicitly found
		if (colorValue && !result.color) {
			result.color = { item: element, value: colorValue };
		}
		if (bgValue && !result.background) {
			result.background = { item: element, value: bgValue };
		}

		// If both found → we're done
		if (result.color && result.background) {
			break;
		}
	}

	// If one missing → use computed style from existing element
	const fallbackElement = result.color?.item || result.background?.item;

	if (fallbackElement) {
		const computed = window.getComputedStyle(fallbackElement);
		if (!result.color) {
			result.color = {
				item: fallbackElement,
				value: rgbOrRgbaToHex(computed.getPropertyValue('color')),
			};
		}
		if (!result.background) {
			result.background = {
				item: fallbackElement,
				value: rgbOrRgbaToHex(computed.getPropertyValue('background-color')),
			};
		}
	}

	return result;
};
