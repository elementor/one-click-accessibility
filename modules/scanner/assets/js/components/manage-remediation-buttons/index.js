import BanIcon from '@elementor/icons/BanIcon';
import TrashIcon from '@elementor/icons/TrashIcon';
import Box from '@elementor/ui/Box';
import Button from '@elementor/ui/Button';
import Divider from '@elementor/ui/Divider';
import IconButton from '@elementor/ui/IconButton';
import { __ } from '@wordpress/i18n';

export const ManageRemediationButtons = () => {
	return (
		<Box display="flex" gap={1}>
			<IconButton
				size="tiny"
				color="error"
				aria-label={__('Remove all remediations', 'pojo-accessibility')}
			>
				<TrashIcon fontSize="tiny" />
			</IconButton>
			<Divider orientation="vertical" flexItem sx={{ my: 0.5 }} />
			<Button
				startIcon={<BanIcon />}
				size="small"
				color="secondary"
				variant="text"
			>
				{__('Disable all', 'pojo-accessibility')}
			</Button>
		</Box>
	);
};
