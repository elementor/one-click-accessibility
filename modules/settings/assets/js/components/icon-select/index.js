import FormControl from '@elementor/ui/FormControl';
import FormLabel from '@elementor/ui/FormLabel';
import Paper from '@elementor/ui/Paper';
import Radio from '@elementor/ui/Radio';
import RadioGroup from '@elementor/ui/RadioGroup';
import Typography from '@elementor/ui/Typography';
import { styled } from '@elementor/ui/styles';
import { useIconDesign } from '@ea11y/hooks';
import { mixpanelService } from '@ea11y/services';
import { cloneElement } from '@wordpress/element';
import { __ } from '@wordpress/i18n';
import options from '../../helpers/accessibility-options';

const StyledPaper = styled(Paper)`
	display: flex;
	flex-direction: column;
	flex-grow: 1;
	gap: 12px;
	align-items: center;
	justify-content: center;
	padding: 24px;
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

const IconSelect = (props) => {
	const { iconDesign, updateIconDesign } = useIconDesign();

	const selectIcon = (icon) => () => {
		updateIconDesign({ icon });
		mixpanelService.sendEvent('icon_type_selected', {
			iconType: icon,
		});
	};

	return (
		<FormControl>
			<FormLabel id="icon-select-radio-buttons-group-label" color="secondary">
				<Typography variant="subtitle2" marginBottom={1}>
					{__('Icon', 'pojo-accessibility')}
				</Typography>
			</FormLabel>

			<RadioGroup
				{...props}
				aria-labelledby="icon-select-radio-buttons-group-label"
				name="icon-select-radio-buttons-group"
				value={iconDesign.icon}
				sx={{
					display: 'flex',
					flexDirection: 'row',
					flexWrap: 'wrap',
					gap: 2,
				}}
			>
				{options.map((option) => (
					<StyledPaper
						key={option.value}
						variant="outlined"
						onClick={selectIcon(option.value)}
						sx={{
							borderColor:
								iconDesign.icon === option.value ? 'info.main' : 'divider',
							borderWidth: iconDesign.icon === option.value ? 2 : 1,
						}}
					>
						{option.icon &&
							cloneElement(option.icon, {
								sx: {
									color: iconDesign.color,
									fontSize: 44,
									height: 44,
									width: 'auto',
								},
							})}
						<Radio
							value={option.value}
							sx={{ opacity: 0, position: 'absolute' }}
						/>
					</StyledPaper>
				))}
			</RadioGroup>
		</FormControl>
	);
};

export default IconSelect;
