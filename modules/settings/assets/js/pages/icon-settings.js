import Container from '@elementor/ui/Container';
import Typography from '@elementor/ui/Typography';
import { styled } from '@elementor/ui/styles';
import { BottomBar } from '@ea11y/components';
import { IconDesignSettings, PositionSettings } from '@ea11y/layouts';
import { mixpanelService } from '@ea11y/services';
import { useEffect } from '@wordpress/element';
import { __ } from '@wordpress/i18n';

const StyledContainer = styled(Container)`
	overflow: auto;
	max-height: 100%;
	padding: ${({ theme }) => theme.spacing(4)};
`;

const IconSettings = () => {
	useEffect(() => {
		mixpanelService.sendEvent('page_view', {
			page: 'Button',
		});
	}, []);

	return (
		<>
			<StyledContainer>
				<Typography variant="h4" fontWeight="400" marginBottom={4}>
					{__('Button', 'pojo-accessibility')}
				</Typography>

				<IconDesignSettings marginBottom={4} />

				<PositionSettings />
			</StyledContainer>

			<BottomBar />
		</>
	);
};

export default IconSettings;
