import ChevronDownIcon from '@elementor/icons/ChevronDownIcon';
import ReloadIcon from '@elementor/icons/ReloadIcon';
import Box from '@elementor/ui/Box';
import Button from '@elementor/ui/Button';
import Menu from '@elementor/ui/Menu';
import MenuItem from '@elementor/ui/MenuItem';
import MenuItemText from '@elementor/ui/MenuItemText';

import { useRef, useState } from '@wordpress/element';
import { __ } from '@wordpress/i18n';

const DisableGlobalRemediationMenu = () => {
	const [isOpened, setIsOpened] = useState(false);
	const anchorEl = useRef(null);

	const handleOpen = () => {
		setIsOpened(true);
	};
	const handleClose = () => setIsOpened(false);

	return (
		<Box display="flex" gap={1}>
			<Button
				id="global-remediation-menu-button"
				startIcon={<ReloadIcon />}
				endIcon={<ChevronDownIcon />}
				size="small"
				color="info"
				variant="text"
				onClick={handleOpen}
				ref={anchorEl}
			>
				{__('Enable all', 'pojo-accessibility')}
			</Button>

			<Menu
				id="global-remediation-menu"
				open={isOpened}
				MenuListProps={{
					'aria-labelledby': 'global-remediation-menu-button',
				}}
				anchorEl={anchorEl.current}
				onClose={handleClose}
				disablePortal
			>
				<MenuItem onClick={() => null} dense>
					<MenuItemText>
						{__('Enable on this page', 'pojo-accessibility')}
					</MenuItemText>
				</MenuItem>
				<MenuItem onClick={() => null} dense>
					<MenuItemText>
						{__('Enable on all pages', 'pojo-accessibility')}
					</MenuItemText>
				</MenuItem>
			</Menu>
		</Box>
	);
};

export default DisableGlobalRemediationMenu;
