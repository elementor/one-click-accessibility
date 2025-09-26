import DotsVerticalIcon from '@elementor/icons/DotsVerticalIcon';
import Box from '@elementor/ui/Box';
import IconButton from '@elementor/ui/IconButton';
import Menu from '@elementor/ui/Menu';
import PropTypes from 'prop-types';
import { BLOCK_TITLES } from '@ea11y-apps/scanner/constants';
import { useRef, useState } from '@wordpress/element';
import { __, sprintf } from '@wordpress/i18n';

export const ButtonMenu = ({ group }) => {
	// const { sortedRemediation } = useScannerWizardContext();
	const anchorEl = useRef(null);
	const [isOpened, setIsOpened] = useState(false);

	// const isAllDisabled =
	// 	sortedRemediation[group]?.length ===
	// 	sortedRemediation[group]?.filter(
	// 		(remediation) => !Number(remediation.active),
	// 	)?.length;

	const handleOpen = () => {
		setIsOpened(true);
	};
	const handleClose = () => setIsOpened(false);

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
			></Menu>
		</Box>
	);
};

ButtonMenu.propTypes = {
	group: PropTypes.string.isRequired,
};
