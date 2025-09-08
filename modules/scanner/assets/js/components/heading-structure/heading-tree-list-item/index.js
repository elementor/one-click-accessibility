import MenuItem from '@elementor/ui/MenuItem';
import Typography from '@elementor/ui/Typography';
import PropTypes from 'prop-types';
import HeadingTreeListItemActions from '@ea11y-apps/scanner/components/heading-structure/heading-tree-list-item/actions';
import HeadingTreeListItemAlert from '@ea11y-apps/scanner/components/heading-structure/heading-tree-list-item/alert';
import HeadingTreeListItemTopWrapper from '@ea11y-apps/scanner/components/heading-structure/heading-tree-list-item/top-wrapper';
import { useHeadingStructureContext } from '@ea11y-apps/scanner/context/heading-structure-context';
import { useHeadingNodeManipulation } from '@ea11y-apps/scanner/hooks/use-heading-node-manipulation';
import { EA11Y_RULES } from '@ea11y-apps/scanner/rules';
import {
	StyledTreeListItem,
	StyledListItemBottomWrapper,
	StyledListItemDetails,
	StyledListItemSelect,
} from '@ea11y-apps/scanner/styles/heading-structure.styles';
import { HEADING_STATUS } from '@ea11y-apps/scanner/types/heading';
import { useState, useEffect } from '@wordpress/element';
import { __ } from '@wordpress/i18n';
import { HEADING_LEVEL } from '../constants';

const HeadingStructureHeadingTreeListItem = ({
	level,
	content,
	node,
	status,
	violation = null,
}) => {
	const { isLoading, updateHeadingsTree, isHeadingExpanded } =
		useHeadingStructureContext();

	const isExpanded = isHeadingExpanded(node);

	const {
		applyNewLevel,
		hasDraft,
		getDraftLevelForDisplay,
		restoreOriginalAttributes,
	} = useHeadingNodeManipulation({
		node,
		isExpanded,
	});

	const isDraft = hasDraft(node);
	const displayLevel = isDraft ? getDraftLevelForDisplay() : `h${level}`;
	const [isDismiss, setIsDismiss] = useState(false);

	const isApplyControlDisabled =
		HEADING_STATUS.ERROR === status ||
		(HEADING_STATUS.WARNING === status && !isDismiss) ||
		(!isDraft && !isDismiss) ||
		isLoading;

	const onLevelChange = (e) => {
		applyNewLevel(e.target.value);

		updateHeadingsTree();
	};

	useEffect(() => {
		if (isDraft && isDismiss) {
			restoreOriginalAttributes();
			setTimeout(() => updateHeadingsTree(), 0);
		}
	}, [isDismiss]);

	return (
		<StyledTreeListItem isExpanded={isExpanded}>
			<HeadingTreeListItemTopWrapper
				displayLevel={displayLevel}
				node={node}
				level={level}
				status={status}
				isDismiss={isDismiss}
				content={content}
			/>

			<StyledListItemDetails isExpanded={isExpanded}>
				<StyledListItemBottomWrapper>
					<StyledListItemSelect
						MenuProps={{ disablePortal: true }}
						fullWidth
						size="small"
						color="secondary"
						error={HEADING_STATUS.ERROR === status}
						name={__('Heading level', 'pojo-accessibility')}
						variant="outlined"
						value={displayLevel}
						onChange={onLevelChange}
						disabled={isDismiss || isLoading}
					>
						{Object.entries(HEADING_LEVEL).map(([key, label]) => (
							<MenuItem key={key} value={key} dense>
								<Typography sx={{ fontSize: '14px' }}>
									<b>{key.toUpperCase()}</b> - {label}
								</Typography>
							</MenuItem>
						))}
					</StyledListItemSelect>

					{(HEADING_STATUS.ERROR === status ||
						(HEADING_STATUS.WARNING === status && !isDismiss)) &&
						violation && (
							<HeadingTreeListItemAlert status={status} violation={violation} />
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
				/>
			</StyledListItemDetails>
		</StyledTreeListItem>
	);
};

HeadingStructureHeadingTreeListItem.propTypes = {
	level: PropTypes.number.isRequired,
	content: PropTypes.string.isRequired,
	node: PropTypes.object.isRequired,
	status: PropTypes.oneOf(Object.values(HEADING_STATUS)).isRequired,
	violation: PropTypes.oneOf(Object.values(EA11Y_RULES)),
};

export default HeadingStructureHeadingTreeListItem;
