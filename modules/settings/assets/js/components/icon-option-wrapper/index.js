import Chip from '@elementor/ui/Chip';
import Paper from '@elementor/ui/Paper';
import Radio from '@elementor/ui/Radio';
import { styled } from '@elementor/ui/styles';
import { WidgetIcon } from '@ea11y/components';
import { useIconDesign } from '@ea11y/hooks';
import { useEffect, useState } from '@wordpress/element';
import { __ } from '@wordpress/i18n';
import { getOptionByValue } from '../../helpers/accessibility-options';

const IconOptionWrapper = ({ iconType, option, clickHandler }) => {
	const { iconDesign } = useIconDesign();
	const [showCustomLabel, setShowCustomLabel] = useState(false);

	useEffect(() => {
		const isCustom = option.value === 'custom' && iconType === 'select';
		setShowCustomLabel(isCustom);
	}, []);
	const icon =
		'select' === iconType
			? option.icon
			: getOptionByValue(iconDesign.icon)?.icon;

	const size = 'select' === iconType ? 44 : option.fontSize;

	const radius = 'select' === iconType ? 100 : null;

	const iconValue =
		'select' === iconType
			? option.value
			: getOptionByValue(iconDesign.icon)?.value;

	if (option.value === 'custom' && !iconDesign.custom) {
		return null;
	}

	const selectVerifier =
		'select' === iconType ? iconDesign.icon : iconDesign.size;

	return (
		<StyledPaper
			key={option.value}
			variant="outlined"
			onClick={clickHandler(option.value)}
			sx={{
				borderColor: selectVerifier === option.value ? 'info.main' : 'divider',
				borderWidth: selectVerifier === option.value ? 2 : 1,
			}}
		>
			{showCustomLabel && (
				<StyledChip label={__('Custom', 'pojo-accessibility')} size="small" />
			)}
			<WidgetIcon
				icon={icon}
				size={size}
				radius={radius}
				color={iconDesign?.color}
				control={iconType}
				type={iconValue}
			/>
			<Radio
				value={option.value}
				inputProps={{
					'aria-label': option.label,
				}}
				sx={{ opacity: 0, position: 'absolute' }}
			/>
		</StyledPaper>
	);
};

export default IconOptionWrapper;

const StyledPaper = styled(Paper)`
	display: flex;
	flex-direction: column;
	flex-grow: 1;
	gap: 12px;
	align-items: center;
	justify-content: center;
	padding: 3px;
	min-width: 10px;
	width: 100px;
	min-height: 100px;
	border-radius: ${({ theme }) => theme.shape.borderRadius};
	box-shadow: ${({ theme }) => theme.shadows[0]};
	cursor: pointer;
	position: relative;

	:hover {
		box-shadow: 0 0 15px 0 rgba(37, 99, 235, 0.15);
		border-color: ${({ theme }) => theme.palette.info.main};
	}
`;

const StyledChip = styled(Chip)`
	position: absolute;
	top: 5px;
	left: 5px;
	font-size: 10px;
	height: 16px;
`;
