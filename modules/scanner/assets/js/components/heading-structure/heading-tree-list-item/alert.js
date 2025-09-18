import AlertTitle from '@elementor/ui/AlertTitle';
import Typography from '@elementor/ui/Typography';
import PropTypes from 'prop-types';
import { EA11Y_RULES } from '@ea11y-apps/scanner/rules';
import { StyledListItemAlert } from '@ea11y-apps/scanner/styles/heading-structure.styles';
import { HEADING_STATUS } from '@ea11y-apps/scanner/types/heading';
import { VIOLATION_PARAMS } from '../constants';

const HeadingTreeListItemAlert = ({ status, violation }) => {
	return (
		<StyledListItemAlert severity={status} icon={false} tabIndex="0">
			<AlertTitle>{VIOLATION_PARAMS[violation]?.title}</AlertTitle>

			<Typography sx={{ fontSize: '14px' }}>
				{VIOLATION_PARAMS[violation]?.description}
			</Typography>
		</StyledListItemAlert>
	);
};

HeadingTreeListItemAlert.propTypes = {
	status: PropTypes.oneOf(Object.values(HEADING_STATUS)).isRequired,
	violation: PropTypes.oneOf(Object.values(EA11Y_RULES)).isRequired,
};

export default HeadingTreeListItemAlert;
