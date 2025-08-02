import getXPath from 'get-xpath';
import PropTypes from 'prop-types';
import xPathToCss from 'xpath-to-css';
import { APIScanner } from '@ea11y-apps/scanner/api/APIScanner';
import {
	BACKGROUND_ELEMENT_CLASS,
	BLOCKS,
	DATA_INITIAL_BG,
	DATA_INITIAL_COLOR,
} from '@ea11y-apps/scanner/constants';
import { useScannerWizardContext } from '@ea11y-apps/scanner/context/scanner-wizard-context';
import { scannerItem } from '@ea11y-apps/scanner/types/scanner-item';
import {
	focusOnElement,
	removeExistingFocus,
} from '@ea11y-apps/scanner/utils/focus-on-element';
import { getElementByXPath } from '@ea11y-apps/scanner/utils/get-element-by-xpath';
import { useEffect, useLayoutEffect } from '@wordpress/element';

export const useColorContrastForm = ({ item, current, setCurrent }) => {
	const {
		openedBlock,
		manualData,
		resolved,
		setResolved,
		isResolved,
		setOpenedBlock,
		setManualData,
		updateRemediationList,
	} = useScannerWizardContext();

	const updateData = (data) => {
		const updData = [...manualData[openedBlock]];
		updData[current] = {
			...(manualData[openedBlock]?.[current] || {}),
			...data,
		};
		setManualData({
			...manualData,
			[openedBlock]: updData,
		});
	};

	useLayoutEffect(() => {
		if (isResolved(BLOCKS.colorContrast)) {
			removeExistingFocus();
			setOpenedBlock(BLOCKS.main);
		}
	}, [manualData]);

	useEffect(() => {
		if (!manualData[openedBlock]?.[current]?.resolved) {
			updateData({
				color: item.messageArgs[3],
				background: item.messageArgs[4],
				parents: [item.path.dom],
			});
		}
		if (!item.node.getAttribute(DATA_INITIAL_COLOR)) {
			item.node.setAttribute(DATA_INITIAL_COLOR, item.messageArgs[3]);
			item.node.style.color = item.messageArgs[3];
		}
	}, [item]);

	const { color, background, parents } =
		manualData[openedBlock]?.[current] ?? {};

	const changeColor = (updColor) => {
		if (item.node?.style) {
			item.node.style.setProperty('color', updColor, 'important');
		}
		updateData({
			color: updColor,
		});
	};

	const changeBackground = (updBackground) => {
		const element = getElementByXPath(parents.at(-1));
		if (!element.getAttribute(DATA_INITIAL_BG)) {
			const initialBackground = window
				.getComputedStyle(element)
				.getPropertyValue('background-color');
			element.setAttribute(DATA_INITIAL_BG, initialBackground);
		}
		if (element?.style) {
			element.style.setProperty('background-color', updBackground, 'important');
		}
		updateData({
			background: updBackground,
		});
	};

	const setParentBackground = (nextElement, element) => {
		if (!nextElement.getAttribute(DATA_INITIAL_BG)) {
			const initialBackground = window
				.getComputedStyle(nextElement)
				.getPropertyValue('background-color');
			nextElement.setAttribute(DATA_INITIAL_BG, initialBackground);
		}
		if (element?.style) {
			element.style.setProperty(
				'background-color',
				element.getAttribute(DATA_INITIAL_BG),
				'important',
			);
		}
		if (nextElement?.style) {
			nextElement.style.setProperty(
				'background-color',
				background,
				'important',
			);
		}
	};

	const setParentLarger = () => {
		const element = getElementByXPath(parents.at(-1));
		if (element.parentElement) {
			const xpath = getXPath(element.parentElement, { ignoreId: true });
			focusOnElement(element.parentElement, BACKGROUND_ELEMENT_CLASS);
			setParentBackground(element.parentElement, element);
			updateData({
				parents: [...parents, xpath],
			});
		}
	};

	const setParentSmaller = () => {
		if (parents.length > 1) {
			const updParents = parents.slice(0, -1);
			const nextElement = getElementByXPath(updParents.at(-1));
			if (updParents.length > 1) {
				focusOnElement(nextElement, BACKGROUND_ELEMENT_CLASS);
			} else {
				removeExistingFocus(BACKGROUND_ELEMENT_CLASS);
			}
			setParentBackground(nextElement);
			updateData({
				parents: updParents,
			});
		}
	};

	const buildCSSRule = () => {
		const colorCSSSelector = xPathToCss(item.path.dom);
		const bgCSSSelector = xPathToCss(parents.at(-1));

		const colorRule = `${colorCSSSelector} {color: ${color} !important;}`;
		const bgRule = `${bgCSSSelector} {background-color: ${background} !important;}`;
		return `${colorRule}${bgRule}`;
	};

	const onSubmit = async () => {
		await APIScanner.submitRemediation({
			url: window?.ea11yScannerData?.pageData.url,
			remediation: {
				rule: buildCSSRule(),
				category: item.reasonCategory.match(/\((AAA?|AA?|A)\)/)?.[1] || '',
				type: 'STYLES',
			},
			rule: item.ruleId,
			group: BLOCKS.colorContrast,
		});

		updateData({
			resolved: true,
		});

		// Left colors
		item.node.removeAttribute(DATA_INITIAL_COLOR);
		getElementByXPath(parents.at(-1))?.removeAttribute(DATA_INITIAL_BG);

		// Remove focus from all
		removeExistingFocus();
		setCurrent(current + 1);
		setResolved(resolved + 1);
		void updateRemediationList();
	};

	return {
		color,
		background,
		parents,
		changeColor,
		changeBackground,
		setParentLarger,
		setParentSmaller,
		onSubmit,
	};
};

useColorContrastForm.propTypes = {
	item: scannerItem.isRequired,
	current: PropTypes.number.isRequired,
	setCurrent: PropTypes.func.isRequired,
};
