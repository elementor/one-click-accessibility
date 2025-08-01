import getXPath from 'get-xpath';
import PropTypes from 'prop-types';
import { BACKGROUND_ELEMENT_CLASS } from '@ea11y-apps/scanner/constants';
import { useScannerWizardContext } from '@ea11y-apps/scanner/context/scanner-wizard-context';
import { scannerItem } from '@ea11y-apps/scanner/types/scanner-item';
import {
	focusOnElement,
	removeExistingFocus,
} from '@ea11y-apps/scanner/utils/focus-on-element';
import { getElementByXPath } from '@ea11y-apps/scanner/utils/get-element-by-xpath';
import { useEffect } from '@wordpress/element';

export const useColorContrastForm = ({ item, current, setCurrent }) => {
	const { openedBlock, manualData, setManualData } = useScannerWizardContext();

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

	useEffect(() => {
		updateData({
			color: item.messageArgs[3],
			background: item.messageArgs[4],
			parents: [item.path.dom],
		});
	}, [item]);

	const { color, background, parents } =
		manualData[openedBlock]?.[current] ?? {};

	const changeColor = (updColor) => {
		if (!item.node.getAttribute('data-initial-color')) {
			const initialBackground = window
				.getComputedStyle(item.node)
				.getPropertyValue('color');
			item.node.setAttribute('data-initial-color', initialBackground);
		}
		if (item.node?.style) {
			item.node.style.color = updColor;
		}
		updateData({
			color: updColor,
		});
	};

	const changeBackground = (updBackground) => {
		const element = getElementByXPath(parents.at(-1));
		if (!element.getAttribute('data-initial-bg')) {
			const initialBackground = window
				.getComputedStyle(element)
				.getPropertyValue('background-color');
			element.setAttribute('data-initial-bg', initialBackground);
		}
		if (element?.style) {
			element.style.background = updBackground;
		}
		updateData({
			background: updBackground,
		});
	};

	const setParentBackground = (nextElement, element) => {
		if (!nextElement.getAttribute('data-initial-bg')) {
			const initialBackground = window
				.getComputedStyle(nextElement)
				.getPropertyValue('background-color');
			nextElement.setAttribute('data-initial-bg', initialBackground);
		}
		if (element?.style) {
			element.style.background = element.getAttribute('data-initial-bg');
		}
		if (nextElement?.style) {
			nextElement.style.background = background;
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

	const onSubmit = () => {
		setCurrent(current + 1);
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
