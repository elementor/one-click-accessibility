import Box from '@elementor/ui/Box';
import Chip from '@elementor/ui/Chip';
import FormLabel from '@elementor/ui/FormLabel';
import MenuItem from '@elementor/ui/MenuItem';
import Select from '@elementor/ui/Select';
import { styled } from '@elementor/ui/styles';
import PropTypes from 'prop-types';
import { StyledTitle } from '@ea11y/pages/pages.styles';
import { __ } from '@wordpress/i18n';

const AccessibilityAssistantHeading = ({
	period,
	onPeriodChange,
	isEmpty,
	loading,
}) => {
	const periodSelectId = 'ea11y-accessibility-wizard-time-range-select';

	return (
		<StyledHeadingContainer>
			<StyledTitle variant="h5">
				{__('Accessibility scans', 'pojo-accessibility')}

				<Chip
					size="small"
					variant="filled"
					color="default"
					label={__('Beta', 'pojo-accessibility')}
				/>
			</StyledTitle>

			<Box>
				<StyledTimeFilterLabel htmlFor={periodSelectId}>
					{__('Display data from', 'pojo-accessibility')}
				</StyledTimeFilterLabel>

				<Select
					id={periodSelectId}
					variant="outlined"
					size="small"
					color="secondary"
					onChange={onPeriodChange}
					value={period}
					disabled={isEmpty || loading}
				>
					<MenuItem value={0}>{__('Today', 'pojo-accessibility')}</MenuItem>
					<MenuItem value={1}>{__('Yesterday', 'pojo-accessibility')}</MenuItem>
					<MenuItem value={7}>
						{__('Last 7 days', 'pojo-accessibility')}
					</MenuItem>
					<MenuItem value={30}>
						{__('Last 30 days', 'pojo-accessibility')}
					</MenuItem>
					<MenuItem value={60}>
						{__('Last 60 days', 'pojo-accessibility')}
					</MenuItem>
				</Select>
			</Box>
		</StyledHeadingContainer>
	);
};

AccessibilityAssistantHeading.propTypes = {
	period: PropTypes.number.isRequired,
	onPeriodChange: PropTypes.func.isRequired,
	isEmpty: PropTypes.bool,
	loading: PropTypes.bool,
};

const StyledHeadingContainer = styled(Box)`
	display: flex;
	justify-content: space-between;
	align-items: center;

	.MuiSelect-select {
		min-width: 270px;
	}
`;

const StyledTimeFilterLabel = styled(FormLabel)`
	margin-inline-end: ${({ theme }) => theme.spacing(1)};

	color: ${({ theme }) => theme.palette.common.black};
	font-weight: 500;
`;

export default AccessibilityAssistantHeading;
