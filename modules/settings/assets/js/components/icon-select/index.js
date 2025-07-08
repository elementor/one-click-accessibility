import FormControl from '@elementor/ui/FormControl';
import FormLabel from '@elementor/ui/FormLabel';
import RadioGroup from '@elementor/ui/RadioGroup';
import Typography from '@elementor/ui/Typography';
import { styled } from '@elementor/ui/styles';
import { IconOptionWrapper } from '@ea11y/components';
import { useIconDesign } from '@ea11y/hooks';
import { mixpanelEvents, mixpanelService } from '@ea11y-apps/global/services';
import { __ } from '@wordpress/i18n';
import options from '../../helpers/accessibility-options';
import MediaUploader from '../media-uploader/media-uploader';

const IconSelect = (props) => {
	const { iconDesign, updateIconDesign } = useIconDesign();

	const selectIcon = (icon) => () => {
		updateIconDesign({ icon });
		mixpanelService.sendEvent(mixpanelEvents.iconTypeSelected, {
			iconType: icon,
		});
	};

	return (
		<FormControl>
			<StyledFormLabel
				id="icon-select-radio-buttons-group-label"
				color="secondary"
			>
				<Typography variant="subtitle2" marginBottom={1}>
					{__('Icon', 'pojo-accessibility')}
				</Typography>
				<MediaUploader />
			</StyledFormLabel>

			<StyledRadioGroup
				{...props}
				aria-labelledby="icon-select-radio-buttons-group-label"
				name="icon-select-radio-buttons-group"
				value={iconDesign.icon}
			>
				{options.map((option) => (
					<IconOptionWrapper
						key={option.value}
						iconType="select"
						option={option}
						clickHandler={selectIcon}
					/>
				))}
			</StyledRadioGroup>
		</FormControl>
	);
};

export default IconSelect;

const StyledRadioGroup = styled(RadioGroup)`
	display: grid;
	flex-direction: row;
	flex-wrap: nowrap;
	gap: ${({ theme }) => theme.spacing(2)};
	grid-template-columns: repeat(4, 1fr);
`;

const StyledFormLabel = styled(FormLabel)`
	display: flex;
	flex-direction: row;
	flex-wrap: nowrap;
	gap: ${({ theme }) => theme.spacing(2)};
	align-items: center;
	justify-content: space-between;
`;
