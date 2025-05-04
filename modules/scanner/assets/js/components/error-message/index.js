import Box from '@elementor/ui/Box';
import Typography from '@elementor/ui/Typography';
import { ErrorImage } from '@ea11y-apps/scanner/images';
import { StateContainer } from '@ea11y-apps/scanner/styles/app.styles';
import { __ } from '@wordpress/i18n';

export const ErrorMessage = () => (
	<StateContainer>
		<ErrorImage />
		<Box sx={{ maxWidth: '300px' }}>
			<Typography variant="h5" align="center" sx={{ mb: 2 }}>
				{__('Well this is unexpected…', 'pojo-accessibility')}
			</Typography>
			<Typography variant="body2" align="center">
				{__(
					'We ran into a technical glitch and are working right now to fix it. Please try again later.',
					'pojo-accessibility',
				)}
			</Typography>
		</Box>
	</StateContainer>
);
