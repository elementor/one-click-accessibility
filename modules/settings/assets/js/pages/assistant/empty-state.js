import Box from '@elementor/ui/Box';
import Typography from '@elementor/ui/Typography';
import { styled } from '@elementor/ui/styles';
import Button from '@ea11y/components/button';
import { AccessibilityAssistantDashboardIcon } from '@ea11y/icons';
import { mixpanelEvents, mixpanelService } from '@ea11y-apps/global/services';
import { __ } from '@wordpress/i18n';
import { addQueryArgs } from '@wordpress/url';
import NumberOneIcon from './icons/number-one-icon';
import NumberThreeIcon from './icons/number-three-icon';
import NumberTwoIcon from './icons/number-two-icon';

const AccessibilityAssistantEmptyState = () => {
	const homeUrl = window?.ea11ySettingsData?.homeUrl;
	const startScanUrl = addQueryArgs(homeUrl, {
		'open-ea11y-assistant': '1',
		'open-ea11y-assistant-src': 'Ally_dashboard',
	});

	const sendAnalytics = () => {
		mixpanelService.sendEvent(mixpanelEvents.assistantDashboardScanCtaClicked, {
			cta_text: 'scan_home_page',
			source: 'empty_state',
		});
	};

	return (
		<StyledWrapper>
			<AccessibilityAssistantDashboardIcon />

			<StyledTitle variant="h6" as="h2">
				{__('Start by scanning your home page', 'pojo-accessibility')}
			</StyledTitle>

			<StyledSubtitle variant="body1">
				{__(
					'Find and resolve accessibility issues for a more inclusive website.',
					'pojo-accessibility',
				)}
			</StyledSubtitle>

			<StyledButton
				size="medium"
				color="info"
				variant="contained"
				href={startScanUrl}
				onClick={sendAnalytics}
				target="_blank"
			>
				{__('Scan home page', 'pojo-accessibility')}
			</StyledButton>

			<StyledGuideContainer>
				<StyledGuideTitle variant="subtitle1" as="h2">
					{__('Here’s how it works', 'pojo-accessibility')}
				</StyledGuideTitle>

				<StyledGuideStepsContainer>
					<StyledGuideStep>
						<StyledGuideStepTitle variant="subtitle2" as="h3">
							<NumberOneIcon />

							{__('Scan a page', 'pojo-accessibility')}
						</StyledGuideStepTitle>

						<Typography variant="body2">
							{__(
								'Automatically find accessibility issues.',
								'pojo-accessibility',
							)}
						</Typography>
					</StyledGuideStep>

					<StyledGuideStep>
						<StyledGuideStepTitle variant="subtitle2" as="h3">
							<NumberTwoIcon />

							{__('Resolve issues', 'pojo-accessibility')}
						</StyledGuideStepTitle>

						<Typography variant="body2">
							{__(
								'Resolve them with Ally, AI, or manually.',
								'pojo-accessibility',
							)}
						</Typography>
					</StyledGuideStep>

					<StyledGuideStep>
						<StyledGuideStepTitle variant="subtitle2" as="h3">
							<NumberThreeIcon />

							{__('Track everything', 'pojo-accessibility')}
						</StyledGuideStepTitle>

						<Typography variant="body2">
							{__(
								'Monitor results, progress, and statuses.',
								'pojo-accessibility',
							)}
						</Typography>
					</StyledGuideStep>
				</StyledGuideStepsContainer>
			</StyledGuideContainer>
		</StyledWrapper>
	);
};

const StyledWrapper = styled(Box)`
	margin-top: ${({ theme }) => theme.spacing(8)};

	text-align: center;
`;

const StyledTitle = styled(Typography)`
	margin-top: ${({ theme }) => theme.spacing(2)};
	margin-bottom: ${({ theme }) => theme.spacing(1)};

	font-size: 20px;
	font-weight: 500;
	line-height: 160%;
	letter-spacing: 0.15px;
	color: ${({ theme }) => theme.palette.text.primary};
`;

const StyledSubtitle = styled(Typography)`
	color: ${({ theme }) => theme.palette.text.secondary};
	margin-bottom: ${({ theme }) => theme.spacing(2)};
`;

const StyledButton = styled(Button)`
	font-size: 15px;
	line-height: 24px;
	letter-spacing: 0.4px;
`;

const StyledGuideContainer = styled(Box)`
	margin-top: ${({ theme }) => theme.spacing(8)};
`;

const StyledGuideTitle = styled(Typography)`
	margin-bottom: ${({ theme }) => theme.spacing(2)};

	color: ${({ theme }) => theme.palette.text.secondary};
	font-size: 16px;
	font-weight: 500;
	line-height: 130%;
	letter-spacing: 0.15px;
`;

const StyledGuideStepsContainer = styled(Box)`
	display: flex;
	flex-wrap: wrap;
	justify-content: center;
	align-items: center;
	gap: ${({ theme }) => theme.spacing(2)};
`;

const StyledGuideStep = styled(Box)`
	max-width: 204px;
	min-height: 104px;

	display: flex;
	flex-direction: column;
	justify-content: center;
	align-items: center;
	padding: ${({ theme }) => `${theme.spacing(2)} ${theme.spacing(3)}`};

	border-radius: ${({ theme }) => theme.shape.borderRadius * 2}px;

	color: ${({ theme }) => theme.palette.text.secondary};
	background: #f3f3f4;
`;

const StyledGuideStepTitle = styled(Typography)`
	display: flex;
	justify-content: center;
	align-items: center;

	margin: 0;
	margin-bottom: ${({ theme }) => theme.spacing(1)};

	color: ${({ theme }) => theme.palette.text.secondary};
	font-size: 14px;
	font-weight: 500;
	letter-spacing: 0.1px;

	& svg {
		margin-inline-end: ${({ theme }) => theme.spacing(1)};
	}
`;

export default AccessibilityAssistantEmptyState;
