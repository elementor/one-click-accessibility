import { rgbOrRgbaToHex } from '@ea11y-apps/scanner/utils/convert-colors';

/**
 * Extract color & background-color from CSS rules and always return valid element + values.
 * If one property is missing, the function reads the other from computed styles.
 *
 * @param {string} cssRules - CSS rules string
 * @return {{
 *   color: { item: Element, value: string } | null,
 *   background: { item: Element, value: string } | null
 * }} css data
 */
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
