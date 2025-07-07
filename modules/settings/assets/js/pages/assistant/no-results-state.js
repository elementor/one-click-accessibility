import Box from '@elementor/ui/Box';
import Typography from '@elementor/ui/Typography';
import { styled } from '@elementor/ui/styles';
import { AccessibilityAssistantNoResultsIcon } from '@ea11y/icons';
import { __ } from '@wordpress/i18n';
import { useAccessibilityAssistantContext } from '../../contexts/accessibility-assistant-context';

const AccessibilityAssistantNoResultsState = () => {
	const { search } = useAccessibilityAssistantContext();

	if (search) {
		return (
			<StyledWrapper>
				<AccessibilityAssistantNoResultsIcon />

				<StyledTitle variant="subtitle1" as="h3">
					{__('No matching results found', 'pojo-accessibility')}
				</StyledTitle>

				<StyledSubtitle variant="body2">
					{__(
						'Try entering something else or checking if the spelling is correct before trying again.',
						'pojo-accessibility',
					)}
				</StyledSubtitle>
			</StyledWrapper>
		);
	}

	return (
		<StyledWrapper>
			<AccessibilityAssistantNoResultsIcon />

			<StyledTitle variant="subtitle1" as="h3">
				{__('No data to display for this period', 'pojo-accessibility')}
			</StyledTitle>

			<StyledSubtitle variant="body2">
				{__(
					'Try selecting a different timeframe to see your scan results.',
					'pojo-accessibility',
				)}
			</StyledSubtitle>
		</StyledWrapper>
	);
};

const StyledWrapper = styled(Box)`
	margin-top: ${({ theme }) => theme.spacing(6)};

	text-align: center;
`;

const StyledTitle = styled(Typography)`
	margin-top: 0;
	margin-bottom: ${({ theme }) => theme.spacing(1)};

	font-size: 16px;
	font-weight: 500;
	line-height: 130%;
	letter-spacing: 0.15px;
	color: ${({ theme }) => theme.palette.text.secondary};
`;

const StyledSubtitle = styled(Typography)`
	color: ${({ theme }) => theme.palette.text.secondary};
`;

export default AccessibilityAssistantNoResultsState;
