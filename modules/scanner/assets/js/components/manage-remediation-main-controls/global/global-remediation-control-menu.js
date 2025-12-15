import ChevronDownIcon from '@elementor/icons/ChevronDownIcon';
import ReloadIcon from '@elementor/icons/ReloadIcon';
import Box from '@elementor/ui/Box';
import Button from '@elementor/ui/Button';
import Menu from '@elementor/ui/Menu';
import MenuItem from '@elementor/ui/MenuItem';
import MenuItemText from '@elementor/ui/MenuItemText';
import PropTypes from 'prop-types';
import { mixpanelEvents, mixpanelService } from '@ea11y-apps/global/services';
import {
	DisableGlobalRemediationModal,
	EnableGlobalRemediationModal,
} from '@ea11y-apps/scanner/components/remediation-confirmation-modal';
import { useScannerWizardContext } from '@ea11y-apps/scanner/context/scanner-wizard-context';
import { useGlobalManageActions } from '@ea11y-apps/scanner/hooks/use-global-manage-actions';
import { StyledBanIcon } from '@ea11y-apps/scanner/styles/app.styles';
import { useRef, useState } from '@wordpress/element';
import { __ } from '@wordpress/i18n';

const GlobalRemediationControlMenu = ({ isAllExcluded, isAllDisabled }) => {
	const { globalRemediations } = useScannerWizardContext();

	const [isOpened, setIsOpened] = useState(false);
	const anchorEl = useRef(null);

	const [showDisableModal, setShowDisableModal] = useState(false);
	const [showEnableModal, setShowEnableModal] = useState(false);

	const {
		updateAllGlobalRemediationForPage,
		updateAllGlobalRemediationForAllPages,
	} = useGlobalManageActions();

	const handleOpen = () => {
		setIsOpened(true);
	};
	const handleClose = () => setIsOpened(false);

	const onUpdateStatus = () => {
		void (isAllDisabled ? setShowEnableModal(true) : setShowDisableModal(true));
		mixpanelService.sendEvent(mixpanelEvents.popupButtonClicked, {
			data: {
				popupType: isAllDisabled
					? 'global_enable_confirmation'
					: 'global_disable_confirmation',
				buttonName: isAllDisabled
					? 'Enable across scans'
					: 'Disable across scans',
			},
		});
	};

	const onUpdateForPage = () => {
		void updateAllGlobalRemediationForPage(isAllExcluded);
	};
	const onUpdateForAllPages = () => {
		void updateAllGlobalRemediationForAllPages(isAllDisabled);
	};

	const toggleDisableModal = () => setShowDisableModal(!showDisableModal);
	const toggleEnableModal = () => setShowDisableModal(!showDisableModal);

	return (
		<Box display="flex" gap={1}>
			<Button
				id="global-remediation-menu-button"
				startIcon={isAllExcluded ? <ReloadIcon /> : <StyledBanIcon />}
				endIcon={<ChevronDownIcon />}
				size="small"
				color={isAllExcluded ? 'info' : 'secondary'}
				variant="text"
				onClick={handleOpen}
				ref={anchorEl}
			>
				{isAllExcluded
					? __('Enable all', 'pojo-accessibility')
					: __('Disable all', 'pojo-accessibility')}
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
				<MenuItem onClick={onUpdateForPage} dense>
					<MenuItemText>
						{isAllExcluded
							? __('Enable on this page', 'pojo-accessibility')
							: __('Disable on this page', 'pojo-accessibility')}
					</MenuItemText>
				</MenuItem>

				<MenuItem onClick={onUpdateStatus} dense>
					<MenuItemText>
						{isAllDisabled
							? __('Enable across scans', 'pojo-accessibility')
							: __('Disable across scans', 'pojo-accessibility')}
					</MenuItemText>
				</MenuItem>
			</Menu>
			<DisableGlobalRemediationModal
				open={showDisableModal}
				hideConfirmation={toggleDisableModal}
				onDisable={onUpdateForAllPages}
				count={globalRemediations.length}
			/>
			<EnableGlobalRemediationModal
				open={showEnableModal}
				hideConfirmation={toggleEnableModal}
				onEnable={onUpdateForAllPages}
				count={globalRemediations.length}
			/>
		</Box>
	);
};

GlobalRemediationControlMenu.propTypes = {
	isAllExcluded: PropTypes.bool.isRequired,
	isAllDisabled: PropTypes.bool.isRequired,
};

export default GlobalRemediationControlMenu;
