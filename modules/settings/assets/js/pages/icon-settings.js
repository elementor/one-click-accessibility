import Typography from '@elementor/ui/Typography';
import { styled } from '@elementor/ui/styles';
import { BottomBar } from '@ea11y/components';
import { IconDesignSettings, PositionSettings } from '@ea11y/layouts';
import { StyledBox, StyledWideBox } from '@ea11y/pages/pages.styles';
import { eventNames, mixpanelService } from '@ea11y/services';
import { useEffect } from '@wordpress/element';
import { __ } from '@wordpress/i18n';

const IconSettings = () => {
	useEffect(() => {
		mixpanelService.sendEvent(eventNames.pageView, {
			page: 'Button',
		});
	}, []);

	return (
		<StyledBox>
			<StyledWideBox>
				<StyledTitle variant="h4" color="text.primary">
					{__('Design', 'pojo-accessibility')}
				</StyledTitle>

				<IconDesignSettings marginBottom={4} />

				<PositionSettings />
			</StyledWideBox>
			<BottomBar />
		</StyledBox>
	);
};

export default IconSettings;

export const StyledTitle = styled(Typography)`
	max-width: 1200px;
	// Spacing
	margin-bottom: 16px;
	margin-right: auto;
	margin-left: auto;
	// Typography
	font-weight: 400;
	letter-spacing: 0.25px;
`;
