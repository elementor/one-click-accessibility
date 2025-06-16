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
				<StyledTitle
					variant="h4"
					color="text.primary"
					sx={{ width: '50%', marginLeft: 'auto', marginRight: 'auto' }}
				>
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
	font-weight: 400;
	letter-spacing: 0.25px;
	margin-bottom: 16px;
	width: 50%;

	${({ theme }) => theme.breakpoints.down('xl')} {
		width: 100%;
	}
`;
