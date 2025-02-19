import { useState } from '@wordpress/element';

export const useModal = (defaultIsOpen = true) => {
	const [isOpen, setIsOpen] = useState(defaultIsOpen);

	const open = () => {
		setIsOpen(true);
	};

	const close = () => {
		setIsOpen(false);
	};

	return {
		isOpen,
		setIsOpen,
		open,
		close,
	};
};
