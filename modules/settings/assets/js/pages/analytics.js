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
				<StyledTitle variant="h4" color="text.primary">
					{__('Analytics', 'pojo-accessibility')}
				</StyledTitle>
				<AnalyticsToggle />
				<Charts />
			</StyledContainer>
		</StyledBox>
	);
};

export default Analytics;
