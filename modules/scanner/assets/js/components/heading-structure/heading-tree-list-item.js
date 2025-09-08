import AlertTitle from '@elementor/ui/AlertTitle';
import Button from '@elementor/ui/Button';
import Checkbox from '@elementor/ui/Checkbox';
import FormControlLabel from '@elementor/ui/FormControlLabel';
import MenuItem from '@elementor/ui/MenuItem';
import Select from '@elementor/ui/Select';
import Typography from '@elementor/ui/Typography';
import PropTypes from 'prop-types';
import { useToastNotification } from '@ea11y-apps/global/hooks';
import { useHeadingStructureContext } from '@ea11y-apps/scanner/context/heading-structure-context';
import { EA11Y_RULES } from '@ea11y-apps/scanner/rules';
import {
	StyledTreeListItem,
	StyledListItemTopWrapper,
	StyledListItemLevelBox,
	StyledListItemContent,
	StyledListItemBottomWrapper,
	StyledListItemActionsWrapper,
	StyledListItemAlert,
	StyledListItemDetails,
} from '@ea11y-apps/scanner/styles/heading-structure.styles';
import { HEADING_STATUS } from '@ea11y-apps/scanner/types/heading';
import { useState, useEffect, useRef } from '@wordpress/element';
import { __ } from '@wordpress/i18n';
import { STATUS_CONFIG, HEADING_LEVEL, VIOLATION_PARAMS } from './constants';

const HeadingStructureHeadingTreeListItem = ({
	level,
	content,
	node,
	status,
	violation = null,
}) => {
	const {
		loading,
		error: asyncActionError,
		updateHeadingsTree,
		onHeadingWarningDismiss,
		onHeadingLevelUpdate,
		isHeadingExpanded,
		toggleHeading,
		collapseHeading,
	} = useHeadingStructureContext();
	const { error } = useToastNotification();
	const isExpanded = isHeadingExpanded(node);
	const [isDismiss, setIsDismiss] = useState(false);
	const [newLevel, setNewLevel] = useState(null);

	const originalAttributes = useRef({
		role: null,
		ariaLevel: null,
		captured: false,
	});

	const config = STATUS_CONFIG[status];
	const IconComponent = config.icon;
	const originalLevel = `h${level}`;
	const areControlsDisabled = (!newLevel && !isDismiss) || loading;

	const onLevelChange = (e) => {
		setNewLevel(e.target.value);
	};

	const onCancel = () => {
		restoreOriginalAttributes();

		setNewLevel(null);
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
		const isSuccess = await onHeadingLevelUpdate({ node, newLevel, violation });

		if (isSuccess) {
			originalAttributes.current.captured = false;

			collapseHeading();
			updateHeadingsTree();
			setNewLevel(null);
		} else {
			error(asyncActionError);
		}
	};

	const onDismiss = async () => {
		const isSuccess = await onHeadingWarningDismiss({ node });

		if (isSuccess) {
			originalAttributes.current.captured = false;

			collapseHeading();
			updateHeadingsTree();
			setIsDismiss(false);
		} else {
			error(asyncActionError);
		}
	};

	const captureOriginalAttributes = () => {
		if (!originalAttributes.current.captured) {
			originalAttributes.current = {
				role: node.getAttribute('role'),
				ariaLevel: node.getAttribute('aria-level'),
				captured: true,
			};
		}
	};

	const restoreOriginalAttributes = () => {
		if (!originalAttributes.current.captured) {
			return;
		}

		const { role, ariaLevel } = originalAttributes.current;

		if (role !== null) {
			node.setAttribute('role', role);
		} else {
			node.removeAttribute('role');
		}

		if (ariaLevel !== null) {
			node.setAttribute('aria-level', ariaLevel);
		} else {
			node.removeAttribute('aria-level');
		}
	};

	const applyNewLevel = (levelValue) => {
		if (levelValue === 'p') {
			node.setAttribute('role', 'paragraph');
			node.removeAttribute('aria-level');
		} else {
			node.setAttribute('role', 'heading');
			node.setAttribute('aria-level', levelValue[1]);
		}
	};

	useEffect(() => {
		if (isExpanded) {
			node.style.boxShadow = '0 0 0 8px #2563EB';
			node.style.borderRadius = '4px';
			node.style.transition = '300ms ease-in-out';
		} else {
			node.style.boxShadow = '';
			node.style.borderRadius = '';
			node.style.transition = '';
		}
	}, [isExpanded]);

	useEffect(() => {
		if (newLevel && newLevel !== originalLevel) {
			captureOriginalAttributes();
			applyNewLevel(newLevel);
		} else if (newLevel === null && originalAttributes.current.captured) {
			restoreOriginalAttributes();
		}
	}, [newLevel, originalLevel]);

	useEffect(() => {
		return () => {
			if (originalAttributes.current.captured) {
				restoreOriginalAttributes();
			}
		};
	}, []);

	return (
		<StyledTreeListItem tabIndex="0" isExpanded={isExpanded}>
			<StyledListItemTopWrapper
				level={level}
				onClick={() => toggleHeading(node)}
			>
				<StyledListItemLevelBox status={status}>
					<Typography as="span" variant="subtitle2">
						H{level}
					</Typography>
				</StyledListItemLevelBox>

				<StyledListItemContent level={level} as="span" variant="body2">
					{content}
				</StyledListItemContent>

				<IconComponent color={config.iconColor} fontSize="small" />
			</StyledListItemTopWrapper>

			<StyledListItemDetails isExpanded={isExpanded}>
				<StyledListItemBottomWrapper>
					<Select
						MenuProps={{ disablePortal: true }}
						fullWidth
						size="small"
						color="info"
						name={__('Heading level', 'pojo-accessibility')}
						variant="outlined"
						value={isDismiss ? originalLevel : (newLevel ?? originalLevel)}
						onChange={onLevelChange}
						disabled={isDismiss || loading}
					>
						{Object.entries(HEADING_LEVEL).map(([key, label]) => (
							<MenuItem key={key} value={key}>
								{label}
							</MenuItem>
						))}
					</Select>

					{[HEADING_STATUS.ERROR, HEADING_STATUS.WARNING].includes(status) &&
						violation && (
							<StyledListItemAlert severity={status} icon={false}>
								<AlertTitle>{VIOLATION_PARAMS[violation]?.title}</AlertTitle>

								<Typography>
									{VIOLATION_PARAMS[violation]?.description}
								</Typography>
							</StyledListItemAlert>
						)}
				</StyledListItemBottomWrapper>

				<StyledListItemActionsWrapper>
					{HEADING_STATUS.WARNING === status && (
						<FormControlLabel
							label={__('Dismiss issue', 'pojo-accessibility')}
							control={<Checkbox color="info" />}
							onChange={(e) => setIsDismiss(e.target.checked)}
						/>
					)}

					<Button
						size="small"
						color="secondary"
						variant="text"
						onClick={onCancel}
						disabled={areControlsDisabled}
					>
						{__('Cancel', 'pojo-accessibility')}
					</Button>

					<Button
						size="small"
						color="info"
						variant="contained"
						disabled={areControlsDisabled}
						onClick={onApply}
					>
						{__('Apply', 'pojo-accessibility')}
					</Button>
				</StyledListItemActionsWrapper>
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
