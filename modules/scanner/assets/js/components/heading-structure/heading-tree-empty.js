import Box from '@elementor/ui/Box';
import Typography from '@elementor/ui/Typography';
import { ErrorImage } from '@ea11y-apps/scanner/images';
import { StateContainer } from '@ea11y-apps/scanner/styles/app.styles';
import { __ } from '@wordpress/i18n';

const HeadingStructureHeadingTreeEmpty = () => {
	return (
		<StateContainer>
			<ErrorImage />

			<Box sx={{ maxWidth: '300px' }}>
				<Typography variant="h5" align="center" sx={{ mb: 2 }}>
					{__('No headings found', 'pojo-accessibility')}
				</Typography>

				<Typography variant="body2" align="center">
					{__(
						'Each page should have a main heading (H1) to establish proper structure and help users understand the page content.',
						'pojo-accessibility',
					)}
				</Typography>
			</Box>
		</StateContainer>
	);
};

export default HeadingStructureHeadingTreeEmpty;
