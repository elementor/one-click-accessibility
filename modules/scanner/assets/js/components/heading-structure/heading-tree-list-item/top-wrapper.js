import Typography from '@elementor/ui/Typography';
import PropTypes from 'prop-types';
import { useHeadingStructureContext } from '@ea11y-apps/scanner/context/heading-structure-context';
import {
	StyledListItemTopWrapper,
	StyledListItemLevelBox,
	StyledListItemContent,
} from '@ea11y-apps/scanner/styles/heading-structure.styles';
import { HEADING_STATUS } from '@ea11y-apps/scanner/types/heading';
import { STATUS_CONFIG } from '../constants';

const HeadingTreeListItemTopWrapper = ({
	status,
	isDismiss,
	level,
	displayLevel,
	content,
	node,
}) => {
	const { isHeadingExpanded, toggleHeading } = useHeadingStructureContext();

	const visualStatus = isDismiss ? HEADING_STATUS.SUCCESS : status;
	const config = STATUS_CONFIG[visualStatus];
	const IconComponent = config.icon;

	return (
		<StyledListItemTopWrapper
			level={level}
			onClick={() => toggleHeading(node)}
			isExpanded={isHeadingExpanded(node)}
		>
			<StyledListItemLevelBox status={visualStatus}>
				<Typography as="span" variant="subtitle2">
					{displayLevel.toUpperCase()}
				</Typography>
			</StyledListItemLevelBox>

			<StyledListItemContent level={level} as="span" variant="body2">
				{content}
			</StyledListItemContent>

			<IconComponent color={config.iconColor} fontSize="small" />
		</StyledListItemTopWrapper>
	);
};

HeadingTreeListItemTopWrapper.propTypes = {
	status: PropTypes.oneOf(Object.values(HEADING_STATUS)).isRequired,
	isDismiss: PropTypes.bool.isRequired,
	level: PropTypes.number.isRequired,
	displayLevel: PropTypes.string.isRequired,
	content: PropTypes.string.isRequired,
	node: PropTypes.object.isRequired,
};

export default HeadingTreeListItemTopWrapper;
