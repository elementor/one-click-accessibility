import FormControl from '@elementor/ui/FormControl';
import RadioGroup from '@elementor/ui/RadioGroup';
import Typography from '@elementor/ui/Typography';
import { IconOptionWrapper } from '@ea11y/components';
import { useIconDesign } from '@ea11y/hooks';
import { mixpanelEvents, mixpanelService } from '@ea11y-apps/global/services';
import { __ } from '@wordpress/i18n';

const IconSize = (props) => {
	const { iconDesign, updateIconDesign } = useIconDesign();

	const options = [
		{ value: 'large', fontSize: 64 },
		{ value: 'medium', fontSize: 44 },
		{ value: 'small', fontSize: 36 },
	];

	const selectIconSize = (size) => () => {
		updateIconDesign({ size });
		mixpanelService.sendEvent(mixpanelEvents.sizeTypeClicked, {
			size,
		});
	};

	return (
		<FormControl>
			<Typography
				variant="subtitle2"
				component="h3"
				id="icon-size-radio-buttons-group-label"
				marginBottom={1}
				color="secondary"
			>
				{__('Size', 'pojo-accessibility')}
			</Typography>

			<RadioGroup
				{...props}
				aria-labelledby="icon-size-radio-buttons-group-label"
				name="icon-size-radio-buttons-group"
				value={iconDesign.size}
				sx={{
					display: 'flex',
					flexDirection: 'row',
					gap: 2,
				}}
			>
				{options.map((option) => (
					<IconOptionWrapper
						key={option.value}
						iconType="size"
						option={option}
						clickHandler={selectIconSize}
					/>
				))}
			</RadioGroup>
		</FormControl>
	);
};

export default IconSize;
