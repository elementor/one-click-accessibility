import Box from '@elementor/ui/Box';
import { AnalyticsToggle, Charts } from '@ea11y/components/analytics';
import {
	StyledBox,
	StyledContainer,
	StyledTitle,
} from '@ea11y/pages/pages.styles';
import { __ } from '@wordpress/i18n';

const Analytics = () => {
	return (
		<StyledBox>
			<StyledContainer>
				<Box
					display="flex"
					alignItems="center"
					justifyContent="space-between"
					sx={{ mb: 5 }}
				>
					<StyledTitle variant="h4" color="text.primary" sx={{ mb: 0 }}>
						{__('Analytics', 'pojo-accessibility')}
					</StyledTitle>
					<AnalyticsToggle />
				</Box>
				<Charts />
			</StyledContainer>
		</StyledBox>
	);
};

export default Analytics;
