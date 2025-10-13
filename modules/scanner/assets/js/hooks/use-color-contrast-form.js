import getXPath from 'get-xpath';
import PropTypes from 'prop-types';
import { mixpanelEvents, mixpanelService } from '@ea11y-apps/global/services';
import { APIScanner } from '@ea11y-apps/scanner/api/APIScanner';
import {
	BACKGROUND_ELEMENT_CLASS,
	BLOCKS,
	DATA_INITIAL_BG,
	DATA_INITIAL_COLOR,
} from '@ea11y-apps/scanner/constants';
import { useScannerWizardContext } from '@ea11y-apps/scanner/context/scanner-wizard-context';
import { scannerItem } from '@ea11y-apps/scanner/types/scanner-item';
import { buildPathToParent } from '@ea11y-apps/scanner/utils/build-path-to-parent';
import { rgbOrRgbaToHex } from '@ea11y-apps/scanner/utils/convert-colors';
import {
	focusOnElement,
	removeExistingFocus,
} from '@ea11y-apps/scanner/utils/focus-on-element';
import { getElementByXPath } from '@ea11y-apps/scanner/utils/get-element-by-xpath';
import { getElementCSSSelector } from '@ea11y-apps/scanner/utils/get-element-css-selector';
import { useEffect, useState } from '@wordpress/element';

export const useColorContrastForm = ({ item, current, setCurrent }) => {
	const {
		openedBlock,
		colorContrastData,
		resolved: resolvedBlock,
		setResolved,
		isResolved,
		isManage,
		sortedRemediation,
		setSortedRemediation,
		setOpenedBlock,
		setColorContrastData,
		setIsManageChanged,
		updateRemediationList,
		currentScanId,
	} = useScannerWizardContext();

	const type = isManage ? 'manage' : 'main';

	const [loading, setLoading] = useState(false);
	const [firstOpen, setFirstOpen] = useState(true);
	const [parentChanged, setParentChanged] = useState(false);

	const updateData = (data) => {
		const updData = [...colorContrastData?.[type]];
		updData[current] = {
			...(colorContrastData?.[type]?.[current] || {}),
			...data,
		};
		setColorContrastData({
			...colorContrastData,
			[type]: updData,
		});
	};

	const sendEvent = (method) => {
		mixpanelService.sendEvent(mixpanelEvents.backgroundAdaptorChanged, {
			method,
		});
	};

	useEffect(() => {
		if (!isManage && !firstOpen && isResolved(BLOCKS.colorContrast)) {
			removeExistingFocus();
			setOpenedBlock(BLOCKS.main);
		}
		setFirstOpen(false);
	}, [colorContrastData]);

	useEffect(() => {
		if (!item?.node?.getAttribute(DATA_INITIAL_COLOR)) {
			const initialColor =
				colorContrastData[type]?.[current]?.color || item.messageArgs[3];
			item.node.setAttribute(DATA_INITIAL_COLOR, initialColor);
			item.node.style.setProperty('color', initialColor, 'important');
		}
	}, [item]);

	const {
		color = item.messageArgs[3] ||
			rgbOrRgbaToHex(
				window.getComputedStyle(item.node).getPropertyValue('color'),
			),
		background = item.messageArgs[4],
		parents = item.isEdit
			? buildPathToParent(item.node, item.parentNode)
			: [item.path.dom],
		resolved = false,
		backgroundChanged = item.isEdit,
	} = colorContrastData[type]?.[current] || {};

	useEffect(() => {
		if (parentChanged) {
			const styles = document.getElementById('ea11y-remediation-styles');
			if (styles) {
				styles.innerHTML = styles.innerHTML.replace(item.data.rule, '');
			}
		}
	}, [parentChanged]);

	const changeColor = (updColor) => {
		item.node?.style?.setProperty('color', updColor, 'important');
		updateData({ color: updColor, resolved: false });
	};

	const changeBackground = (updBackground) => {
		const element = getElementByXPath(parents.at(-1));
		if (!element) {
			return;
		}

		if (!element.getAttribute(DATA_INITIAL_BG)) {
			const initial = window
				.getComputedStyle(element)
				.getPropertyValue('background-color');
			element.setAttribute(DATA_INITIAL_BG, initial);
		}

		element.style?.setProperty('background-color', updBackground, 'important');
		updateData({
			background: updBackground,
			resolved: false,
			backgroundChanged: true,
		});
	};

	const setParentBackground = (nextElement, element) => {
		if (!nextElement) {
			return;
		}

		if (!nextElement.getAttribute(DATA_INITIAL_BG)) {
			const initial = window
				.getComputedStyle(nextElement)
				.getPropertyValue('background-color');
			nextElement.setAttribute(DATA_INITIAL_BG, initial);
		}

		element?.style?.setProperty(
			'background-color',
			element?.getAttribute(DATA_INITIAL_BG),
			'important',
		);

		nextElement.style?.setProperty('background-color', background, 'important');
	};

	const setParentLarger = () => {
		const element = getElementByXPath(parents.at(-1));
		const parent = element?.parentElement;
		if (!element || !parent) {
			return;
		}

		try {
			const xpath = getXPath(parent, { ignoreId: true });
			focusOnElement(parent, BACKGROUND_ELEMENT_CLASS);
			setParentBackground(parent, element);

			updateData({
				parents: [...parents, xpath],
				resolved: false,
			});
			setParentChanged(true);
			sendEvent('plus');
		} catch (error) {
			console.warn('Failed to get XPath for parent element:', error);
		}
	};

	const setParentSmaller = () => {
		const newParents = parents.slice(0, -1);
		const nextElement = getElementByXPath(newParents.at(-1));
		if (parents.length <= 1 || !nextElement) {
			return;
		}

		if (newParents.length > 1) {
			focusOnElement(nextElement, BACKGROUND_ELEMENT_CLASS);
		} else {
			removeExistingFocus(BACKGROUND_ELEMENT_CLASS);
		}

		setParentBackground(nextElement);
		updateData({ parents: newParents, resolved: false });
		setParentChanged(true);
		sendEvent('minus');
	};

	const isValidHexColor = (str) =>
		/^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6}|[0-9a-fA-F]{8})$/.test(str.trim());

	const isValidCSS = (cssText) => {
		try {
			// Basic checks for common malicious patterns
			if (!cssText || typeof cssText !== 'string') {
				return false;
			}

			// Check for basic CSS structure and disallow dangerous patterns
			const dangerousPatterns = [
				/@import/i,
				/javascript:/i,
				/expression\s*\(/i,
				/behavior\s*:/i,
				/binding\s*:/i,
				/-moz-binding/i,
			];

			if (dangerousPatterns.some((pattern) => pattern.test(cssText))) {
				return false;
			}

			// More comprehensive CSS structure validation
			const cssRegex = /^[\s\S]*\{\s*[\s\S]+:\s*[\s\S]+;\s*\}[\s\S]*$/;
			const hasBasicStructure = cssRegex.test(
				cssText.replace(/\s+/g, ' ').trim(),
			);

			// Additional validation: check for balanced braces
			const openBraces = (cssText.match(/\{/g) || []).length;
			const closeBraces = (cssText.match(/\}/g) || []).length;

			return hasBasicStructure && openBraces === closeBraces && openBraces > 0;
		} catch (e) {
			return false;
		}
	};

	const buildCSSRule = () => {
		if (
			!isValidHexColor(color) ||
			(background && !isValidHexColor(background))
		) {
			throw new Error('Invalid hex color input detected');
		}

		try {
			const colorSelector = getElementCSSSelector(item.path.dom);
			const bgSelector = getElementCSSSelector(
				parents.length > 0 ? parents.at(-1) : item.path.dom,
			);

			const colorRule =
				color !== item.messageArgs[3] || (color && item.isEdit)
					? `${colorSelector} {color: ${color} !important;}`
					: '';

			const bgRule =
				background && (background !== item.messageArgs[4] || item.isEdit)
					? `${bgSelector} {background-color: ${background} !important;}`
					: '';

			const css = `${colorRule}${bgRule}`;

			return isValidCSS(css) ? css : '';
		} catch (e) {
			console.warn('Failed to convert XPath to CSS selector', e);
			return '';
		}
	};

	const updateCSS = (rule) => {
		let styles = document.getElementById('ea11y-remediation-styles');
		if (styles) {
			styles.innerHTML = `${styles.innerHTML} ${rule}`;
		} else {
			styles = document.createElement('style');
			styles.id = 'ea11y-remediation-styles';
			document.head.appendChild(styles);
			styles.innerHTML += rule;
		}
	};

	const onUpdate = async () => {
		const rule = buildCSSRule();
		try {
			setLoading(true);
			const updContent = JSON.stringify({
				...item.data,
				rule,
			});
			await APIScanner.updateRemediationContent({
				url: window?.ea11yScannerData?.pageData?.url,
				id: item.id,
				content: updContent,
			});
			const updated = sortedRemediation[openedBlock].map((remediation) =>
				item.id === remediation.id
					? { ...remediation, content: updContent }
					: remediation,
			);

			setSortedRemediation({
				...sortedRemediation,
				[openedBlock]: updated,
			});
			setIsManageChanged(true);
			removeExistingFocus();
			setParentChanged(false);
			updateCSS(rule);
			void updateRemediationList();
		} catch (e) {
			console.error(e);
		} finally {
			setLoading(false);
		}
	};

	const onSubmit = async () => {
		setLoading(true);
		try {
			const rule = buildCSSRule();
			await APIScanner.submitRemediation({
				url: window?.ea11yScannerData?.pageData?.url,
				remediation: {
					rule,
					category: item.reasonCategory.match(/\((AAA?|AA?|A)\)/)?.[1] || '',
					type: 'STYLES',
					xpath: item.path.dom,
				},
				rule: item.ruleId,
				group: BLOCKS.colorContrast,
			});

			await APIScanner.resolveIssue(currentScanId);

			updateData({ resolved: true });

			item.node?.removeAttribute(DATA_INITIAL_COLOR);
			getElementByXPath(
				parents.length > 0 ? parents.at(-1) : item.path.dom,
			)?.removeAttribute(DATA_INITIAL_BG);

			removeExistingFocus();
			setCurrent(current + 1);
			setResolved(resolvedBlock + 1);
			setParentChanged(false);
			updateCSS(rule);
			void updateRemediationList();
		} catch (error) {
			console.error('Failed to submit remediation:', error);
		} finally {
			setLoading(false);
		}
	};

	return {
		color,
		background,
		parents,
		resolved,
		backgroundChanged,
		parentChanged,
		loading,
		changeColor,
		changeBackground,
		setParentLarger,
		setParentSmaller,
		onSubmit,
		onUpdate,
	};
};

useColorContrastForm.propTypes = {
	item: scannerItem.isRequired,
	current: PropTypes.number.isRequired,
	setCurrent: PropTypes.func.isRequired,
};
