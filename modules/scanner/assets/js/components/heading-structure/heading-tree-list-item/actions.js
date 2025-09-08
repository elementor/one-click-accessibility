import Button from '@elementor/ui/Button';
import Checkbox from '@elementor/ui/Checkbox';
import PropTypes from 'prop-types';
import { useToastNotification } from '@ea11y-apps/global/hooks';
import { useHeadingStructureContext } from '@ea11y-apps/scanner/context/heading-structure-context';
import { useHeadingNodeManipulation } from '@ea11y-apps/scanner/hooks/use-heading-node-manipulation';
import { EA11Y_RULES } from '@ea11y-apps/scanner/rules';
import {
	StyledListItemActionsWrapper,
	StyledListItemDismissLabel,
} from '@ea11y-apps/scanner/styles/heading-structure.styles';
import { HEADING_STATUS } from '@ea11y-apps/scanner/types/heading';
import { __ } from '@wordpress/i18n';

const HeadingTreeListItemActions = ({
	node,
	status,
	isDisabled,
	isDismiss,
	setIsDismiss,
	displayLevel,
	violation,
}) => {
	const { error } = useToastNotification();
	const {
		isLoading,
		error: asyncActionError,
		updateHeadingsTree,
		onHeadingWarningDismiss,
		onHeadingLevelUpdate,
		isHeadingExpanded,
		collapseHeading,
	} = useHeadingStructureContext();

	const isExpanded = isHeadingExpanded(node);

	const { restoreOriginalAttributes, clearOriginalAttributes } =
		useHeadingNodeManipulation({
			node,
			isExpanded,
		});

	const onCancel = () => {
		restoreOriginalAttributes();
		setTimeout(() => updateHeadingsTree(), 0);

		setIsDismiss(false);
		collapseHeading();
	};

	const onApply = async () => {
		if (isDismiss) {
			await onDismiss();
		} else {
			await onLevelUpdate();
		}
	};

	const onLevelUpdate = async () => {
		const isSuccess = await onHeadingLevelUpdate({
			node,
			newLevel: displayLevel,
			rule: violation,
		});

		if (isSuccess) {
			if ('p' === displayLevel) {
				node.setAttribute('role', 'presentation');
			}

			collapseHeading();
			clearOriginalAttributes();

			setTimeout(() => updateHeadingsTree(), 0);
		} else {
			error(asyncActionError);
		}
	};

	const onDismiss = async () => {
		const isSuccess = await onHeadingWarningDismiss({ node });

		if (isSuccess) {
			collapseHeading();
			setIsDismiss(false);

			setTimeout(() => updateHeadingsTree(), 0);
		} else {
			error(asyncActionError);
		}
	};

	return (
		<StyledListItemActionsWrapper>
			{HEADING_STATUS.WARNING === status && (
				<StyledListItemDismissLabel
					label={__('Dismiss issue', 'pojo-accessibility')}
					control={<Checkbox color="info" checked={isDismiss} size="small" />}
					onChange={(e) => setIsDismiss(e.target.checked)}
				/>
			)}

			<Button
				size="small"
				color="secondary"
				variant="text"
				onClick={onCancel}
				disabled={isLoading}
			>
				{__('Cancel', 'pojo-accessibility')}
			</Button>

			<Button
				size="small"
				color="info"
				variant="contained"
				disabled={isDisabled}
				onClick={onApply}
			>
				{__('Apply', 'pojo-accessibility')}
			</Button>
		</StyledListItemActionsWrapper>
	);
};

HeadingTreeListItemActions.propTypes = {
	status: PropTypes.oneOf(Object.values(HEADING_STATUS)).isRequired,
	node: PropTypes.object.isRequired,
	isDisabled: PropTypes.bool.isRequired,
	isDismiss: PropTypes.bool.isRequired,
	setIsDismiss: PropTypes.func.isRequired,
	displayLevel: PropTypes.string.isRequired,
	violation: PropTypes.oneOf(Object.values(EA11Y_RULES)),
};

export default HeadingTreeListItemActions;
