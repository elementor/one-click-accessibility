import { useState } from '@wordpress/element';

export const useWhatsNew = () => {
	const [isSidebarOpen, setIsSidebarOpen] = useState(false);

	const open = () => {
		setIsSidebarOpen(true);
	};

	const close = () => {
		setIsSidebarOpen(false);
	};

	return {
		isSidebarOpen,
		open,
		close,
	};
};
