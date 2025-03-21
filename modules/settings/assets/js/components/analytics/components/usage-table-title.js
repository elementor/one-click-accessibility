import InfoCircleIcon from '@elementor/icons/InfoCircleIcon';
import Box from '@elementor/ui/Box';
import Infotip from '@elementor/ui/Infotip';
import Typography from '@elementor/ui/Typography';
import { __ } from '@wordpress/i18n';

export const UsageTableTitle = () => (
	<Box display="flex" gap={1}>
		<Typography variant="subtitle1">
			{__('Most used features', 'pojo-accessibility')}
		</Typography>
		<Infotip
			content={
				<Typography variant="body1" sx={{ p: 2, maxWidth: '300px' }}>
					{__(
						'Track how often all your widget’s accessibility features are used.',
						'pojo-accessibility',
					)}
				</Typography>
			}
		>
			<InfoCircleIcon fontSize="small" />
		</Infotip>
	</Box>
);
