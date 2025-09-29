import Typography from '@elementor/ui/Typography';
import PropTypes from 'prop-types';
import { mixpanelEvents, mixpanelService } from '@ea11y-apps/global/services';
import {
	StyledListItemContent,
	StyledListItemLevelBox,
	StyledListItemTopWrapper,
} from '@ea11y-apps/scanner/styles/heading-structure.styles';
import {
	HEADING_STATUS,
	HEADING_STATUS_DESCRIPTION,
} from '@ea11y-apps/scanner/types/heading';
import { keyForNode } from '@ea11y-apps/scanner/utils/page-headings';
import { STATUS_CONFIG } from '../constants';

const HeadingTreeListItemTopWrapper = ({
	id,
	status,
	isDismiss,
	level,
	node,
	displayLevel,
	content,
	isExpanded,
	toggleHeading,
}) => {
	const visualStatus = isDismiss ? HEADING_STATUS.SUCCESS : status;
	const config = STATUS_CONFIG[visualStatus];
	const IconComponent = config.icon;

	const onHeadingClick = () => {
		if (!isExpanded) {
			mixpanelService.sendEvent(mixpanelEvents.headingClicked, {
				level: displayLevel,
				location: keyForNode(node).replace('heading-tree-', ''),
			});
		}

		toggleHeading();
	};

	return (
		<StyledListItemTopWrapper
			level={level}
			onClick={onHeadingClick}
			isExpanded={isExpanded}
			aria-expanded={isExpanded}
			aria-controls={id}
			aria-invalid={HEADING_STATUS.SUCCESS !== status}
			aria-description={HEADING_STATUS_DESCRIPTION[status]}
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
	isExpanded: PropTypes.bool.isRequired,
	toggleHeading: PropTypes.func.isRequired,
};

export default HeadingTreeListItemTopWrapper;
