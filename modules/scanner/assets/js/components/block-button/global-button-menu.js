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
import { DeleteRemediationModal } from '@ea11y-apps/scanner/components/delete-remediation-modal';
import { BLOCK_TITLES } from '@ea11y-apps/scanner/constants';
import { useScannerWizardContext } from '@ea11y-apps/scanner/context/scanner-wizard-context';
import { StyledBanIcon } from '@ea11y-apps/scanner/styles/app.styles';
import { useRef, useState } from '@wordpress/element';
import { __, sprintf } from '@wordpress/i18n';

export const GlobalButtonMenu = ({ group }) => {
	const { sortedGlobalRemediation } = useScannerWizardContext();
	// const { deleteAllRemediationForPage, updateAllRemediationForPage } =
	// 	useManageActions();
	const anchorEl = useRef(null);

	const [showDeleteModal, setShowDeleteModal] = useState(false);
	const [isOpened, setIsOpened] = useState(false);

	const count = sortedGlobalRemediation[group]?.length;

	const isAllExcluded =
		count ===
		sortedGlobalRemediation[group]?.filter(
			(remediation) => remediation.excluded,
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

	const toggleDeleteModal = () => setShowDeleteModal(!showDeleteModal);

	const onDeleteRemediation = async () => {
		setShowDeleteModal(false);
		//await deleteAllRemediationForPage(group);
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
				{isAllExcluded ? (
					<MenuItem onClick={() => null} dense>
						<MenuItemIcon>
							<ReloadIcon fontSize="tiny" />
						</MenuItemIcon>

						<MenuItemText>
							{__('Enable on this page', 'pojo-accessibility')}
						</MenuItemText>
					</MenuItem>
				) : (
					<MenuItem onClick={() => null} dense>
						<MenuItemIcon>
							<StyledBanIcon fontSize="tiny" />
						</MenuItemIcon>

						<MenuItemText>
							{__('Disable on this page', 'pojo-accessibility')}
						</MenuItemText>
					</MenuItem>
				)}
				{isAllDisabled ? (
					<MenuItem onClick={() => null} dense>
						<MenuItemIcon>
							<ReloadIcon fontSize="tiny" />
						</MenuItemIcon>

						<MenuItemText>
							{__('Enable across scans', 'pojo-accessibility')}
						</MenuItemText>
					</MenuItem>
				) : (
					<MenuItem onClick={() => null} dense>
						<MenuItemIcon>
							<StyledBanIcon fontSize="tiny" />
						</MenuItemIcon>

						<MenuItemText>
							{__('Disable across scans', 'pojo-accessibility')}
						</MenuItemText>
					</MenuItem>
				)}
				<MenuItem onClick={toggleDeleteModal} dense>
					<MenuItemIcon>
						<TrashIcon fontSize="tiny" />
					</MenuItemIcon>

					<MenuItemText>
						{__('Remove across scans', 'pojo-accessibility')}
					</MenuItemText>
				</MenuItem>
			</Menu>
			<DeleteRemediationModal
				open={showDeleteModal}
				hideConfirmation={toggleDeleteModal}
				onDelete={onDeleteRemediation}
				count={count}
				isMain
			/>
		</Box>
	);
};

GlobalButtonMenu.propTypes = {
	group: PropTypes.string.isRequired,
};
