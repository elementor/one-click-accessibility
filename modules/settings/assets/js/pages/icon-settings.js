import { BottomBar } from '@ea11y/components';
import { IconDesignSettings, PositionSettings } from '@ea11y/layouts';
import {
	StyledBox,
	StyledContainer,
	StyledTitle,
} from '@ea11y/pages/pages.styles';
import { mixpanelService } from '@ea11y/services';
import { useEffect } from '@wordpress/element';
import { __ } from '@wordpress/i18n';

const IconSettings = () => {
	useEffect(() => {
		mixpanelService.sendEvent('page_view', {
			page: 'Button',
		});
	}, []);

	return (
		<StyledBox>
			<StyledContainer>
				<StyledTitle variant="h4" color="text.primary">
					{__('Button', 'pojo-accessibility')}
				</StyledTitle>

				<IconDesignSettings marginBottom={4} />

				<PositionSettings />
			</StyledContainer>
			<BottomBar />
		</StyledBox>
	);
};

export default IconSettings;
