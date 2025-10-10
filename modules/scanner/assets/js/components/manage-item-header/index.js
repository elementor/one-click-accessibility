import EditIcon from '@elementor/icons/EditIcon';
import SettingsIcon from '@elementor/icons/SettingsIcon';
import Box from '@elementor/ui/Box';
import IconButton from '@elementor/ui/IconButton';
import Tooltip from '@elementor/ui/Tooltip';
import Typography from '@elementor/ui/Typography';
import PropTypes from 'prop-types';
import {
	ItemHeader,
	ItemTitle,
} from '@ea11y-apps/scanner/styles/manual-fixes.styles';
import { __ } from '@wordpress/i18n';

export const ManageItemHeader = ({ isActive, openEdit }) => {
	return (
		<ItemHeader>
			<ItemTitle>
				<SettingsIcon />
				<Typography variant="subtitle2">
					{isActive
						? __('Active fix', 'pojo-accessibility')
						: __('Fix (disabled)', 'pojo-accessibility')}
				</Typography>
			</ItemTitle>

			<Box display="flex" gap={0.5}>
				<Tooltip
					placement="top"
					title={__('Edit', 'pojo-accessibility')}
					PopperProps={{
						disablePortal: true,
					}}
				>
					<IconButton size="small" onClick={openEdit}>
						<EditIcon fontSize="small" />
					</IconButton>
				</Tooltip>
			</Box>
		</ItemHeader>
	);
};

ManageItemHeader.propTypes = {
	isActive: PropTypes.bool.isRequired,
	openEdit: PropTypes.func.isRequired,
};
