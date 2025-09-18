import Button from '@elementor/ui/Button';
import Checkbox from '@elementor/ui/Checkbox';
import PropTypes from 'prop-types';
import { useToastNotification } from '@ea11y-apps/global/hooks';
import { mixpanelEvents, mixpanelService } from '@ea11y-apps/global/services';
import { useHeadingStructureContext } from '@ea11y-apps/scanner/context/heading-structure-context';
import { useHeadingNodeManipulation } from '@ea11y-apps/scanner/hooks/use-heading-node-manipulation';
import { EA11Y_RULES } from '@ea11y-apps/scanner/rules';
import {
	StyledListItemActionsWrapper,
	StyledListItemDismissLabel,
} from '@ea11y-apps/scanner/styles/heading-structure.styles';
import { HEADING_STATUS } from '@ea11y-apps/scanner/types/heading';
import { getHeadingXpath } from '@ea11y-apps/scanner/utils/page-headings';
import { __ } from '@wordpress/i18n';

const HeadingTreeListItemActions = ({
	node,
	status,
	isDisabled,
	isDismiss,
	setIsDismiss,
	setIsSubmitted,
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
		collapseHeading,
	} = useHeadingStructureContext();

	const { restoreOriginalAttributes, clearOriginalAttributes } =
		useHeadingNodeManipulation({ node });

	const onCancel = () => {
		restoreOriginalAttributes();
		setTimeout(() => updateHeadingsTree(), 0);

		setIsDismiss(false);
		collapseHeading();
	};

	const onApply = async () => {
		setIsSubmitted(true);
		if (isDismiss) {
			await onDismiss();
		}
		await onLevelUpdate();
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

			mixpanelService.sendEvent(mixpanelEvents.applyFixButtonClicked, {
				fix_method: 'Headings',
				category_name: 'Headings',
				issue_type: violation,
			});
		} else {
			error(asyncActionError);
		}
	};

	const onDismiss = async () => {
		const isSuccess = await onHeadingWarningDismiss({ node });
		if (isSuccess) {
			collapseHeading();
			setIsDismiss(false);

			mixpanelService.sendEvent(mixpanelEvents.markAsResolveClicked, {
				category_name: 'Headings',
				issue_type: violation,
				element_selector: getHeadingXpath(node),
			});

			setTimeout(() => updateHeadingsTree(), 0);
		} else {
			error(asyncActionError);
		}
	};

	return (
		<StyledListItemActionsWrapper>
			{HEADING_STATUS.WARNING === status && (
				<StyledListItemDismissLabel
					label={__('Not an issue', 'pojo-accessibility')}
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
	setIsSubmitted: PropTypes.func.isRequired,
	displayLevel: PropTypes.string.isRequired,
	violation: PropTypes.oneOf(Object.values(EA11Y_RULES)),
	isExpanded: PropTypes.bool.isRequired,
};

export default HeadingTreeListItemActions;
