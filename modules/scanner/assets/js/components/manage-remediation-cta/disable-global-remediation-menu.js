import ChevronDownIcon from '@elementor/icons/ChevronDownIcon';
import Box from '@elementor/ui/Box';
import Button from '@elementor/ui/Button';
import Menu from '@elementor/ui/Menu';
import MenuItem from '@elementor/ui/MenuItem';
import MenuItemText from '@elementor/ui/MenuItemText';
import PropTypes from 'prop-types';
import { StyledBanIcon } from '@ea11y-apps/scanner/styles/app.styles';
import { useRef, useState } from '@wordpress/element';
import { __ } from '@wordpress/i18n';

const DisableGlobalRemediationMenu = ({ isAllExcluded }) => {
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
				startIcon={<StyledBanIcon />}
				endIcon={<ChevronDownIcon />}
				size="small"
				color="secondary"
				variant="text"
				onClick={handleOpen}
				ref={anchorEl}
			>
				{__('Disable all', 'pojo-accessibility')}
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
				{isAllExcluded ? (
					<MenuItem onClick={() => null} dense>
						<MenuItemText>
							{__('Enable on this page', 'pojo-accessibility')}
						</MenuItemText>
					</MenuItem>
				) : (
					<MenuItem onClick={() => null} dense>
						<MenuItemText>
							{__('Disable on this page', 'pojo-accessibility')}
						</MenuItemText>
					</MenuItem>
				)}

				<MenuItem onClick={() => null} dense>
					<MenuItemText>
						{__('Disable on all pages', 'pojo-accessibility')}
					</MenuItemText>
				</MenuItem>
			</Menu>
		</Box>
	);
};

DisableGlobalRemediationMenu.propTypes = {
	isAllExcluded: PropTypes.bool.isRequired,
};

export default DisableGlobalRemediationMenu;
