import getXPath from 'get-xpath';
import PropTypes from 'prop-types';
import { mixpanelEvents, mixpanelService } from '@ea11y-apps/global/services';
import {
	isValidCSS,
	rgbOrRgbaToHex,
} from '@ea11y-apps/global/utils/color-contrast-helpers';
import { APIScanner } from '@ea11y-apps/scanner/api/APIScanner';
import {
	BACKGROUND_ELEMENT_CLASS,
	BLOCKS,
} from '@ea11y-apps/scanner/constants';
import { useScannerWizardContext } from '@ea11y-apps/scanner/context/scanner-wizard-context';
import { scannerItem } from '@ea11y-apps/scanner/types/scanner-item';
import { buildPathToParent } from '@ea11y-apps/scanner/utils/build-path-to-parent';
import {
	focusOnElement,
	removeExistingFocus,
} from '@ea11y-apps/scanner/utils/focus-on-element';
import { getElementByXPath } from '@ea11y-apps/scanner/utils/get-element-by-xpath';
import { getElementCSSSelector } from '@ea11y-apps/scanner/utils/get-element-css-selector';
import { getOuterHtmlByXpath } from '@ea11y-apps/scanner/utils/get-outer-html-by-xpath';
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
	const [isGlobal, setIsGlobal] = useState(item.global || false);

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

		const rule = buildCSSRule(data.parents);
		updateCSS(rule);
	};

	const sendEvent = (method) => {
		mixpanelService.sendEvent(mixpanelEvents.backgroundAdaptorChanged, {
			method,
		});
	};

	useEffect(() => {
		setIsGlobal(item.global || false);
	}, [current]);

	useEffect(() => {
		if (!isManage && !firstOpen && isResolved(BLOCKS.colorContrast)) {
			removeExistingFocus();
			setOpenedBlock(BLOCKS.main);
		}
		setFirstOpen(false);
	}, [colorContrastData]);

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
		if (isManage && parentChanged) {
			const styles = document.getElementById('ea11y-remediation-styles');
			if (styles) {
				styles.innerHTML = styles.innerHTML.replace(item.data.rule, '');
			}
		}
	}, [parentChanged]);

	const changeColor = (updColor) => {
		updateData({ color: updColor, resolved: false });
	};

	const changeBackground = (updBackground) => {
		const element = getElementByXPath(parents.at(-1));
		if (!element) {
			return;
		}

		updateData({
			background: updBackground,
			resolved: false,
			backgroundChanged: true,
		});
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

		updateData({ parents: newParents, resolved: false });
		setParentChanged(true);
		sendEvent('minus');
	};

	const isValidHexColor = (str) =>
		/^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6}|[0-9a-fA-F]{8})$/.test(str.trim());

	const buildCSSRule = (newParents = null) => {
		const currentParents = newParents || parents;
		const currentParent =
			currentParents.length > 0 ? currentParents.at(-1) : item.path.dom;

		if (
			!isValidHexColor(color) ||
			(background && !isValidHexColor(background))
		) {
			throw new Error('Invalid hex color input detected');
		}

		try {
			const bgElement = getElementByXPath(currentParent);
			const colorSelector = getElementCSSSelector(item.node);
			const bgSelector = getElementCSSSelector(bgElement);

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
		let styles = document.getElementById('ea11y-remediation-styles-edit');
		if (!styles) {
			styles = document.createElement('style');
			styles.id = 'ea11y-remediation-styles-edit';
			document.body.appendChild(styles);
		}
		styles.innerHTML = rule;
	};

	const onUpdate = async () => {
		const rule = buildCSSRule();
		const find = getOuterHtmlByXpath(item.path.dom);
		const parentXPath = parents.length > 0 ? parents.at(-1) : null;
		const parentFind = getOuterHtmlByXpath(parentXPath);

		try {
			setLoading(true);
			const updContent = JSON.stringify({
				...item.data,
				rule,
				find,
				parentFind,
				parentXPath,
			});
			await APIScanner.updateRemediationContent({
				url: window?.ea11yScannerData?.pageData?.url,
				id: item.id,
				content: updContent,
				global: isGlobal,
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
		const parentXPath = parents.length > 0 ? parents.at(-1) : null;
		const parentFind = getOuterHtmlByXpath(parentXPath);
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
					find: item.snippet,
					parentFind,
					parentXPath,
				},
				global: isGlobal,
				rule: item.ruleId,
				group: BLOCKS.colorContrast,
			});

			await APIScanner.resolveIssue(currentScanId);

			updateData({ resolved: true });

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
		isGlobal,
		setIsGlobal,
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
