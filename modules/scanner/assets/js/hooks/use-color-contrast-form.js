import PropTypes from 'prop-types';
import { scannerItem } from '@ea11y-apps/scanner/types/scanner-item';
import { useState } from '@wordpress/element';

export const useColorContrastForm = ({ item, current, setCurrent }) => {
	const [color, setColor] = useState(item.messageArgs[3]);
	const [background, setBackground] = useState(item.messageArgs[4]);

	const changeColor = (updColor) => {
		setColor(updColor);
		if (item.node?.style) {
			item.node.style.color = updColor;
		}
	};

	const changeBackground = (updBackground) => {
		setBackground(updBackground);
		if (item.node?.style) {
			item.node.style.background = updBackground;
		}
	};

	const onSubmit = () => {
		setCurrent(current + 1);
	};

	return {
		color,
		background,
		changeColor,
		changeBackground,
		onSubmit,
	};
};

useColorContrastForm.propTypes = {
	item: scannerItem.isRequired,
	current: PropTypes.number.isRequired,
	setCurrent: PropTypes.func.isRequired,
};
