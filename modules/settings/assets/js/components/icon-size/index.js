import FormControl from '@elementor/ui/FormControl';
import FormLabel from '@elementor/ui/FormLabel';
import Paper from '@elementor/ui/Paper';
import Radio from '@elementor/ui/Radio';
import RadioGroup from '@elementor/ui/RadioGroup';
import Typography from '@elementor/ui/Typography';
import { styled } from '@elementor/ui/styles';
import { useIconDesign } from '@ea11y/hooks';
import { eventNames, mixpanelService } from '@ea11y/services';
import { cloneElement } from '@wordpress/element';
import { __ } from '@wordpress/i18n';
import { getOptionByValue } from '../../helpers/accessibility-options';

const StyledPaper = styled(Paper)`
	display: flex;
	flex-direction: column;
	flex-grow: 1;
	gap: 12px;
	align-items: center;
	justify-content: center;
	padding: 16px;
	min-width: 10px;
	width: 100px;
	min-height: 100px;
	border-radius: ${({ theme }) => theme.shape.borderRadius};
	box-shadow: ${({ theme }) => theme.shadows[0]};
	cursor: pointer;

	:hover {
		box-shadow: 0 0 15px 0 rgba(37, 99, 235, 0.15);
		border-color: ${({ theme }) => theme.palette.info.main};
	}
`;
const IconSize = (props) => {
	const { iconDesign, updateIconDesign } = useIconDesign();
	const icon = getOptionByValue(iconDesign.icon);

	const options = [
		{ value: 'large', fontSize: 64 },
		{ value: 'medium', fontSize: 44 },
		{ value: 'small', fontSize: 36 },
	];

	const selectIconSize = (size) => () => {
		updateIconDesign({ size });
		mixpanelService.sendEvent(eventNames.sizeTypeClicked, {
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
					<StyledPaper
						key={option.value}
						variant="outlined"
						onClick={selectIconSize(option.value)}
						sx={{
							borderColor:
								iconDesign.size === option.value ? 'info.main' : 'divider',
							borderWidth: iconDesign.size === option.value ? 2 : 1,
						}}
					>
						{icon?.icon &&
							cloneElement(icon.icon, {
								sx: {
									color: iconDesign.color,
									fontSize: option.fontSize,
									height: option.fontSize,
									width: 'auto',
								},
							})}

						<Radio
							value={option.value}
							inputProps={{
								'aria-label': option.value,
							}}
							sx={{ opacity: 0, position: 'absolute' }}
						/>
					</StyledPaper>
				))}
			</RadioGroup>
		</FormControl>
	);
};

export default IconSize;
