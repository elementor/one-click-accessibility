import EditIcon from '@elementor/icons/EditIcon';
import SettingsIcon from '@elementor/icons/SettingsIcon';
import WorldIcon from '@elementor/icons/WorldIcon';
import Box from '@elementor/ui/Box';
import Chip from '@elementor/ui/Chip';
import IconButton from '@elementor/ui/IconButton';
import Tooltip from '@elementor/ui/Tooltip';
import Typography from '@elementor/ui/Typography';
import PropTypes from 'prop-types';
import {
	ItemHeader,
	ItemTitle,
} from '@ea11y-apps/scanner/styles/manual-fixes.styles';
import { __ } from '@wordpress/i18n';

export const ManageItemHeader = ({ isActive, openEdit, global }) => {
	return (
		<ItemHeader>
			<ItemTitle>
				<SettingsIcon />
				<Typography variant="subtitle2">
					{isActive
						? __('Active fix', 'pojo-accessibility')
						: __('Fix (disabled)', 'pojo-accessibility')}
				</Typography>
				{global && (
					<Chip
						icon={<WorldIcon fontSize="small" />}
						label={__('Cross-scan', 'pojo-accessibility')}
						color="default"
						variant="outlined"
						size="tiny"
					/>
				)}
			</ItemTitle>

			<Box display="flex" alignItems="center">
				{global ? (
					<Tooltip
						placement="top"
						title={__(
							"You can't edit cross-scan fixes with Ally",
							'pojo-accessibility',
						)}
						PopperProps={{
							disablePortal: true,
						}}
					>
						<EditIcon fontSize="small" color="disabled" />
					</Tooltip>
				) : (
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
				)}
			</Box>
		</ItemHeader>
	);
};

ManageItemHeader.propTypes = {
	isActive: PropTypes.bool.isRequired,
	openEdit: PropTypes.func.isRequired,
	global: PropTypes.bool.isRequired,
};
