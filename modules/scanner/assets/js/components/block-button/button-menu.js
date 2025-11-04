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
import { DeletePageRemediationModal } from '@ea11y-apps/scanner/components/remediation-confirmation-modal';
import { BLOCK_TITLES } from '@ea11y-apps/scanner/constants';
import { useScannerWizardContext } from '@ea11y-apps/scanner/context/scanner-wizard-context';
import { useManageActions } from '@ea11y-apps/scanner/hooks/use-manage-actions';
import { StyledBanIcon } from '@ea11y-apps/scanner/styles/app.styles';
import { useRef, useState } from '@wordpress/element';
import { __, sprintf } from '@wordpress/i18n';

export const ButtonMenu = ({ group }) => {
	const { sortedRemediation } = useScannerWizardContext();
	const { deleteAllRemediationForPage, updateAllRemediationForPage } =
		useManageActions();
	const anchorEl = useRef(null);

	const [showDeleteModal, setShowDeleteModal] = useState(false);
	const [isOpened, setIsOpened] = useState(false);

	const count = sortedRemediation[group]?.length;

	const isAllDisabled =
		count ===
		sortedRemediation[group]?.filter(
			(remediation) => !Number(remediation.active),
		)?.length;

	const handleOpen = () => {
		setIsOpened(true);
	};
	const handleClose = () => setIsOpened(false);

	const toggleDeleteModal = () => setShowDeleteModal(!showDeleteModal);

	const onDeleteRemediation = async () => {
		setShowDeleteModal(false);
		await deleteAllRemediationForPage(group);
	};

	return (
		<Box>
			<IconButton
				id={`${group}-menu-button`}
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
				id={`${group}-manage-menu`}
				anchorEl={anchorEl.current}
				onClose={handleClose}
				anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
				transformOrigin={{ vertical: 'top', horizontal: 'right' }}
				MenuListProps={{
					'aria-labelledby': `${group}-menu-button`,
				}}
				PaperProps={{
					style: {
						overflow: 'visible',
					},
				}}
				disablePortal
			>
				{isAllDisabled ? (
					<MenuItem onClick={updateAllRemediationForPage(true, group)} dense>
						<MenuItemIcon>
							<ReloadIcon fontSize="tiny" />
						</MenuItemIcon>

						<MenuItemText>
							{__('Enable all', 'pojo-accessibility')}
						</MenuItemText>
					</MenuItem>
				) : (
					<MenuItem onClick={updateAllRemediationForPage(false, group)} dense>
						<MenuItemIcon>
							<StyledBanIcon fontSize="tiny" />
						</MenuItemIcon>

						<MenuItemText>
							{__('Disable all', 'pojo-accessibility')}
						</MenuItemText>
					</MenuItem>
				)}
				<MenuItem onClick={toggleDeleteModal} dense>
					<MenuItemIcon>
						<TrashIcon fontSize="tiny" />
					</MenuItemIcon>

					<MenuItemText>{__('Remove all', 'pojo-accessibility')}</MenuItemText>
				</MenuItem>
			</Menu>
			<DeletePageRemediationModal
				open={showDeleteModal}
				hideConfirmation={toggleDeleteModal}
				onDelete={onDeleteRemediation}
				count={count}
				isMain
			/>
		</Box>
	);
};

ButtonMenu.propTypes = {
	group: PropTypes.string.isRequired,
};
