import FormControl from '@elementor/ui/FormControl';
import FormLabel from '@elementor/ui/FormLabel';
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
			<FormLabel id="icon-size-radio-buttons-group-label" color="secondary">
				<Typography variant="subtitle2" marginBottom={1}>
					{__('Size', 'pojo-accessibility')}
				</Typography>
			</FormLabel>

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
