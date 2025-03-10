import InfoCircleIcon from '@elementor/icons/InfoCircleIcon';
import Box from '@elementor/ui/Box';
import Infotip from '@elementor/ui/Infotip';
import Typography from '@elementor/ui/Typography';
import { __ } from '@wordpress/i18n';

export const PieChartTitle = () => (
	<Box display="flex" gap={1}>
		<Typography variant="subtitle1">
			{__('Feature usage', 'pojo-accessibility')}
		</Typography>
		<Infotip
			content={
				<Typography variant="body1" sx={{ p: 2, maxWidth: '300px' }}>
					{__(
						"Track which accessibility features visitors use most from your widget so you can better understand your audience's needs.",
						'pojo-accessibility',
					)}
				</Typography>
			}
		>
			<InfoCircleIcon fontSize="small" />
		</Infotip>
	</Box>
);
