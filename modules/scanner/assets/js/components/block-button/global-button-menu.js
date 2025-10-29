import DotsVerticalIcon from '@elementor/icons/DotsVerticalIcon';
import ReloadIcon from '@elementor/icons/ReloadIcon';
import TrashIcon from '@elementor/icons/TrashIcon';
import Box from '@elementor/ui/Box';
import IconButton from '@elementor/ui/IconButton';

import Menu from '@elementor/ui/Menu';
import MenuItem from '@elementor/ui/MenuItem';
import MenuItemIcon from '@elementor/ui/MenuItemIcon';
import MenuItemText from '@elementor/ui/MenuItemText';
import PropTypes from 'prop-types';
import { mixpanelEvents, mixpanelService } from '@ea11y-apps/global/services';
import {
	DeleteGlobalRemediationModal,
	DisableGlobalRemediationModal,
	EnableGlobalRemediationModal,
} from '@ea11y-apps/scanner/components/remediation-confirmation-modal';
import { BLOCK_TITLES } from '@ea11y-apps/scanner/constants';
import { useScannerWizardContext } from '@ea11y-apps/scanner/context/scanner-wizard-context';
import { useGlobalManageActions } from '@ea11y-apps/scanner/hooks/use-global-manage-actions';
import { StyledBanIcon } from '@ea11y-apps/scanner/styles/app.styles';
import { useRef, useState } from '@wordpress/element';
import { __, sprintf } from '@wordpress/i18n';

export const GlobalButtonMenu = ({ group }) => {
	const { sortedGlobalRemediation } = useScannerWizardContext();
	const {
		updateGlobalRemediationGroupForPage,
		updateGlobalRemediationGroupForAllPages,
		deleteGlobalRemediations,
	} = useGlobalManageActions();
	const anchorEl = useRef(null);

	const [showDeleteModal, setShowDeleteModal] = useState(false);
	const [showDisableModal, setShowDisableModal] = useState(false);
	const [showEnableModal, setShowEnableModal] = useState(false);

	const [isOpened, setIsOpened] = useState(false);

	const count = sortedGlobalRemediation[group]?.length;

	const isAllExcluded =
		count ===
		sortedGlobalRemediation[group]?.filter(
			(remediation) => !Number(remediation.active_for_page),
		)?.length;

	const isAllDisabled =
		count ===
		sortedGlobalRemediation[group]?.filter(
			(remediation) => !Number(remediation.active),
		)?.length;

	const handleClose = () => setIsOpened(false);
	const handleOpen = () => {
		setIsOpened(true);
	};

	const onShowDeleteModal = () => {
		setShowDeleteModal(true);
		mixpanelService.sendEvent(mixpanelEvents.popupButtonClicked, {
			data: {
				popupType: 'global_delete_confirmation',
				buttonName: 'Remove across scans',
			},
		});
	};
	const onHideDeleteModal = () => setShowDeleteModal(false);
	const toggleDisableModal = () => setShowDisableModal(!showDisableModal);
	const toggleEnableModal = () => setShowDisableModal(!showDisableModal);

	const onUpdateStatus = () => {
		void (isAllDisabled ? setShowEnableModal(true) : setShowDisableModal(true));
		mixpanelService.sendEvent(mixpanelEvents.popupButtonClicked, {
			data: {
				popupType: isAllDisabled
					? 'global_enable_confirmation'
					: 'global_disable_confirmation',
				buttonName: isAllDisabled
					? __('Enable across scans', 'pojo-accessibility')
					: __('Disable across scans', 'pojo-accessibility'),
			},
		});
	};

	const onUpdateForPage = () => {
		void updateGlobalRemediationGroupForPage(isAllExcluded, group);
	};

	const onUpdateForAllPages = () => {
		void updateGlobalRemediationGroupForAllPages(isAllDisabled, group);
	};

	const onDeleteRemediation = () => {
		setShowDeleteModal(false);
		void deleteGlobalRemediations(group);
	};

	return (
		<Box>
			<IconButton
				id={`${group}-menu-button--global`}
				aria-controls={isOpened ? `${group}-manage-menu` : undefined}
				aria-expanded={isOpened ? 'true' : undefined}
				aria-haspopup="true"
				onClick={handleOpen}
				ref={anchorEl}
				size="tiny"
				aria-label={sprintf(
					// Translators: %s - group title
					__('%s menu', 'pojo-accessibility'),
					BLOCK_TITLES[group],
				)}
			>
				<DotsVerticalIcon fontSize="tiny" />
			</IconButton>
			<Menu
				open={isOpened}
				id={`${group}-manage-menu--global`}
				anchorEl={anchorEl.current}
				onClose={handleClose}
				anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
				transformOrigin={{ vertical: 'top', horizontal: 'right' }}
				MenuListProps={{
					'aria-labelledby': `${group}-menu-button--global`,
				}}
				PaperProps={{
					style: {
						overflow: 'visible',
					},
				}}
				disablePortal
			>
				<MenuItem onClick={onUpdateForPage} dense>
					{isAllExcluded ? (
						<>
							<MenuItemIcon>
								<ReloadIcon fontSize="tiny" />
							</MenuItemIcon>

							<MenuItemText>
								{__('Enable on this page', 'pojo-accessibility')}
							</MenuItemText>
						</>
					) : (
						<>
							<MenuItemIcon>
								<StyledBanIcon fontSize="tiny" />
							</MenuItemIcon>

							<MenuItemText>
								{__('Disable on this page', 'pojo-accessibility')}
							</MenuItemText>
						</>
					)}
				</MenuItem>

				<MenuItem onClick={onUpdateStatus} dense>
					{isAllDisabled ? (
						<>
							<MenuItemIcon>
								<ReloadIcon fontSize="tiny" />
							</MenuItemIcon>

							<MenuItemText>
								{__('Enable across scans', 'pojo-accessibility')}
							</MenuItemText>
						</>
					) : (
						<>
							<MenuItemIcon>
								<StyledBanIcon fontSize="tiny" />
							</MenuItemIcon>

							<MenuItemText>
								{__('Disable across scans', 'pojo-accessibility')}
							</MenuItemText>
						</>
					)}
				</MenuItem>

				<MenuItem onClick={onShowDeleteModal} dense>
					<MenuItemIcon>
						<TrashIcon fontSize="tiny" />
					</MenuItemIcon>

					<MenuItemText>
						{__('Remove across scans', 'pojo-accessibility')}
					</MenuItemText>
				</MenuItem>
			</Menu>
			<DeleteGlobalRemediationModal
				open={showDeleteModal}
				hideConfirmation={onHideDeleteModal}
				onDelete={onDeleteRemediation}
				count={count}
				isMain
			/>
			<DisableGlobalRemediationModal
				open={showDisableModal}
				hideConfirmation={toggleDisableModal}
				onDisable={onUpdateForAllPages}
				count={count}
			/>
			<EnableGlobalRemediationModal
				open={showEnableModal}
				hideConfirmation={toggleEnableModal}
				onEnable={onUpdateForAllPages}
				count={count}
			/>
		</Box>
	);
};

GlobalButtonMenu.propTypes = {
	group: PropTypes.string.isRequired,
};
