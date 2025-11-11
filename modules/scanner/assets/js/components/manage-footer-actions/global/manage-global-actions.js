import ChevronDownIcon from '@elementor/icons/ChevronDownIcon';
import ReloadIcon from '@elementor/icons/ReloadIcon';
import Box from '@elementor/ui/Box';
import Button from '@elementor/ui/Button';
import Menu from '@elementor/ui/Menu';
import MenuItem from '@elementor/ui/MenuItem';
import MenuItemText from '@elementor/ui/MenuItemText';
import DeleteGlobalItem from '@ea11y-apps/scanner/components/manage-footer-actions/global/delete-global-item';
import { useGlobalManageActions } from '@ea11y-apps/scanner/hooks/use-global-manage-actions';
import { StyledBanIcon } from '@ea11y-apps/scanner/styles/app.styles';
import { scannerItem } from '@ea11y-apps/scanner/types/scanner-item';
import { useRef, useState } from '@wordpress/element';
import { __ } from '@wordpress/i18n';

const ManageGlobalActions = ({ item }) => {
	const [isOpened, setIsOpened] = useState(false);
	const anchorEl = useRef(null);

	const isDisabled = item.active !== '1';
	const isExcluded = item.active_for_page !== '1';

	const {
		activeRequest,
		updateGlobalRemediationForPage,
		updateGlobalRemediationForAllPages,
	} = useGlobalManageActions();

	const handleOpen = () => {
		setIsOpened(true);
	};
	const handleClose = () => setIsOpened(false);

	const onUpdateForPage = () => {
		handleClose();
		void updateGlobalRemediationForPage(item.id, isExcluded, item.rule);
	};
	const onUpdateForAllPages = () => {
		handleClose();
		void updateGlobalRemediationForAllPages(item.id, isDisabled, item.rule);
	};

	return (
		<Box display="flex" gap={1} justifyContent="flex-end">
			{isDisabled && isExcluded && (
				<DeleteGlobalItem id={item.id} rule={item.rule} />
			)}
			<Button
				id="global-remediation-menu-button"
				startIcon={isExcluded ? <ReloadIcon /> : <StyledBanIcon />}
				endIcon={<ChevronDownIcon />}
				size="small"
				color={isExcluded ? 'info' : 'secondary'}
				variant="outlined"
				disabled={activeRequest}
				onClick={handleOpen}
				ref={anchorEl}
				sx={{ ml: 1 }}
			>
				{isExcluded
					? __('Enable fix', 'pojo-accessibility')
					: __('Disable fix', 'pojo-accessibility')}
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
				<MenuItem onClick={onUpdateForPage} disabled={activeRequest} dense>
					<MenuItemText>
						{isExcluded
							? __('Enable on this page', 'pojo-accessibility')
							: __('Disable on this page', 'pojo-accessibility')}
					</MenuItemText>
				</MenuItem>

				<MenuItem onClick={onUpdateForAllPages} disabled={activeRequest} dense>
					<MenuItemText>
						{isDisabled
							? __('Enable across scans', 'pojo-accessibility')
							: __('Disable across scans', 'pojo-accessibility')}
					</MenuItemText>
				</MenuItem>
			</Menu>
		</Box>
	);
};

ManageGlobalActions.propTypes = {
	item: scannerItem,
};

export default ManageGlobalActions;
