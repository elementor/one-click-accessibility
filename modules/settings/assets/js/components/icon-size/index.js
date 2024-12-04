import FormControl from '@elementor/ui/FormControl';
import FormLabel from '@elementor/ui/FormLabel';
import Paper from '@elementor/ui/Paper';
import Radio from '@elementor/ui/Radio';
import RadioGroup from '@elementor/ui/RadioGroup';
import Typography from '@elementor/ui/Typography';
import { useIconDesign } from '@ea11y/hooks';
import { cloneElement } from '@wordpress/element';
import { __ } from '@wordpress/i18n';
import { getOptionByValue } from '../../helpers/accessibility-options';

const IconSize = (props) => {
	const { iconDesign, updateIconDesign } = useIconDesign();
	const icon = getOptionByValue(iconDesign.icon);

	const options = [
		{ value: 'large', fontSize: 64 },
		{ value: 'medium', fontSize: 44 },
		{ value: 'small', fontSize: 36 },
	];
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
					<Paper
						key={option.value}
						variant="outlined"
						onClick={() => updateIconDesign({ size: option.value })}
						sx={{
							borderRadius: 'md',
							boxShadow: 'sm',
							display: 'flex',
							flexDirection: 'column',
							alignItems: 'center',
							justifyContent: 'center',
							flexGrow: 1,
							gap: 1.5,
							p: 2,
							minWidth: 10,
							minHeight: 100,
							borderColor:
								iconDesign.size === option.value ? 'info.main' : 'divider',
							borderWidth: iconDesign.size === option.value ? 2 : 1,
							cursor: 'pointer',
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
							sx={{ opacity: 0, position: 'absolute' }}
						/>
					</Paper>
				))}
			</RadioGroup>
		</FormControl>
	);
};

export default IconSize;
