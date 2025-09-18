import Collapse from '@elementor/ui/Collapse';
import PropTypes from 'prop-types';
import { mixpanelEvents, mixpanelService } from '@ea11y-apps/global/services';
import HeadingTreeListItemActions from '@ea11y-apps/scanner/components/heading-structure/heading-tree-list-item/actions';
import HeadingTreeListItemAlert from '@ea11y-apps/scanner/components/heading-structure/heading-tree-list-item/alert';
import HeadingTreeListItemTopWrapper from '@ea11y-apps/scanner/components/heading-structure/heading-tree-list-item/top-wrapper';
import { useHeadingStructureContext } from '@ea11y-apps/scanner/context/heading-structure-context';
import { useHeadingNodeManipulation } from '@ea11y-apps/scanner/hooks/use-heading-node-manipulation';
import { EA11Y_RULES } from '@ea11y-apps/scanner/rules';
import {
	StyledListItemBottomWrapper,
	StyledListItemDetails,
	StyledListItemSelect,
	StyledTreeListItem,
} from '@ea11y-apps/scanner/styles/heading-structure.styles';
import { HEADING_STATUS } from '@ea11y-apps/scanner/types/heading';
import { memo, useEffect, useState } from '@wordpress/element';
import { __ } from '@wordpress/i18n';
import { HEADING_OPTIONS } from '../constants';

const HeadingStructureHeadingTreeListItemBase = ({
	id,
	level,
	content,
	node,
	status,
	violation = null,
	isExpanded,
	toggleHeading,
}) => {
	const { isLoading, updateHeadingsTree } = useHeadingStructureContext();

	const {
		applyNewLevel,
		hasDraft,
		getDraftLevelForDisplay,
		restoreOriginalAttributes,
	} = useHeadingNodeManipulation({ node });

	const isDraft = hasDraft(node);
	const displayLevel = isDraft ? getDraftLevelForDisplay() : `h${level}`;
	const [isDismiss, setIsDismiss] = useState(false);
	const [isSubmitted, setIsSubmitted] = useState(false);

	const isApplyControlDisabled =
		(HEADING_STATUS.WARNING === status && !isDismiss) ||
		(!isDraft && !isDismiss) ||
		isLoading;

	const onLevelChange = (e) => {
		mixpanelService.sendEvent(mixpanelEvents.headingSelected, {
			previous_heading: displayLevel,
			new_heading: e.target.value.toUpperCase(),
		});

		applyNewLevel(e.target.value);
		setIsSubmitted(false);

		updateHeadingsTree();
	};

	const applyExpandedStyles = () => {
		node.style.boxShadow = '0 0 0 8px #2563EB';
		node.style.borderRadius = '4px';
		node.style.transition = '300ms ease-in-out';

		node.scrollIntoView({
			behavior: 'smooth',
		});
	};

	const removeExpandedStyles = () => {
		node.style.boxShadow = '';
		node.style.borderRadius = '';
		node.style.transition = '';
	};

	useEffect(() => {
		if (isExpanded) {
			applyExpandedStyles();
		} else {
			removeExpandedStyles();
			if (!isSubmitted) {
				restoreOriginalAttributes();
				setTimeout(() => updateHeadingsTree(), 0);
				setIsSubmitted(false);
			}
		}
	}, [isExpanded]);

	return (
		<StyledTreeListItem isExpanded={isExpanded}>
			<HeadingTreeListItemTopWrapper
				displayLevel={displayLevel}
				id={id}
				level={level}
				status={status}
				isDismiss={isDismiss}
				content={content}
				isExpanded={isExpanded}
				toggleHeading={toggleHeading}
			/>

			<Collapse
				in={isExpanded}
				timeout={190}
				unmountOnExit
				mountOnEnter
				appear={false}
				sx={{ width: '100%' }}
			>
				<StyledListItemDetails role="region" aria-labelledby={id}>
					<StyledListItemBottomWrapper>
						<StyledListItemSelect
							MenuProps={{ disablePortal: true }}
							fullWidth
							size="small"
							color="secondary"
							error={HEADING_STATUS.ERROR === status}
							aria-label={__('Select new heading level', 'pojo-accessibility')}
							variant="outlined"
							value={displayLevel}
							onChange={onLevelChange}
							disabled={isDismiss || isLoading}
						>
							{HEADING_OPTIONS}
						</StyledListItemSelect>

						{(HEADING_STATUS.ERROR === status ||
							(HEADING_STATUS.WARNING === status && !isDismiss)) &&
							violation && (
								<HeadingTreeListItemAlert
									status={status}
									violation={violation}
								/>
							)}
					</StyledListItemBottomWrapper>

					<HeadingTreeListItemActions
						status={status}
						node={node}
						isDisabled={isApplyControlDisabled}
						isDismiss={isDismiss}
						setIsDismiss={setIsDismiss}
						displayLevel={displayLevel}
						violation={violation}
						isExpanded={isExpanded}
						setIsSubmitted={setIsSubmitted}
					/>
				</StyledListItemDetails>
			</Collapse>
		</StyledTreeListItem>
	);
};

const HeadingStructureHeadingTreeListItem = memo(
	HeadingStructureHeadingTreeListItemBase,
	(prev, next) =>
		prev.id === next.id &&
		prev.level === next.level &&
		prev.content === next.content &&
		prev.node === next.node &&
		prev.status === next.status &&
		prev.violation === next.violation &&
		prev.isExpanded === next.isExpanded,
);

HeadingStructureHeadingTreeListItem.propTypes = {
	id: PropTypes.string.isRequired,
	level: PropTypes.number.isRequired,
	content: PropTypes.string.isRequired,
	node: PropTypes.object.isRequired,
	status: PropTypes.oneOf(Object.values(HEADING_STATUS)).isRequired,
	violation: PropTypes.oneOf(Object.values(EA11Y_RULES)),
	isExpanded: PropTypes.bool.isRequired,
	toggleHeading: PropTypes.func.isRequired,
};

export default HeadingStructureHeadingTreeListItem;
