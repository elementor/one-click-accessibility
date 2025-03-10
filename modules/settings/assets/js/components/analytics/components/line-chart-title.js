import InfoCircleIcon from '@elementor/icons/InfoCircleIcon';
import Box from '@elementor/ui/Box';
import Infotip from '@elementor/ui/Infotip';
import Typography from '@elementor/ui/Typography';
import { __ } from '@wordpress/i18n';

export const LineChartTitle = () => (
	<Box display="flex" gap={1}>
		<Typography variant="subtitle1">
			{__('Widget opens', 'pojo-accessibility')}
		</Typography>
		<Infotip
			content={
				<Typography variant="body1" sx={{ p: 2, maxWidth: '300px' }}>
					{__(
						'Track how often visitors clicked your accessibility widget to open it so you see how many people are actively seeking accessibility features on your site.',
						'pojo-accessibility',
					)}
				</Typography>
			}
		>
			<InfoCircleIcon fontSize="small" />
		</Infotip>
	</Box>
);
