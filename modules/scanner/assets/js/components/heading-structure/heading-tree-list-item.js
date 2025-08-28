import { Button } from '@elementor/ui';
import Checkbox from '@elementor/ui/Checkbox';
import FormControlLabel from '@elementor/ui/FormControlLabel';
import MenuItem from '@elementor/ui/MenuItem';
import Select from '@elementor/ui/Select';
import Typography from '@elementor/ui/Typography';
import PropTypes from 'prop-types';
import {
	StyledTreeListItem,
	StyledListItemTopWrapper,
	StyledListItemLevelBox,
	StyledListItemContent,
	StyledListItemBottomWrapper,
	StyledListItemActionsWrapper,
} from '@ea11y-apps/scanner/styles/heading-structure.styles';
import { useState } from '@wordpress/element';
import { __ } from '@wordpress/i18n';
import { STATUS_CONFIG, HEADING_LEVEL, HEADING_STATUS } from './constants';

const HeadingStructureHeadingTreeListItem = ({
	level,
	content,
	status = HEADING_STATUS.SUCCESS,
}) => {
	const [isExpanded, setExpanded] = useState(false);
	const [newLevel, setNewLevel] = useState(null);
	const config = STATUS_CONFIG[status];
	const IconComponent = config.icon;
	const originalLevel = `h${level}`;

	const onLevelChange = (e) => {
		setNewLevel(e.target.value);
	};

	const onCancel = () => {
		setNewLevel(null);
	};

	return (
		<StyledTreeListItem>
			<StyledListItemTopWrapper
				level={level}
				onClick={() => setExpanded(!isExpanded)}
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

			{isExpanded && (
				<>
					<StyledListItemBottomWrapper>
						<Select
							MenuProps={{ disablePortal: true }}
							fullWidth
							size="small"
							color="info"
							name={__('Heading level', 'pojo-accessibility')}
							variant="outlined"
							value={newLevel ?? originalLevel}
							onChange={onLevelChange}
						>
							{Object.entries(HEADING_LEVEL).map(([key, label]) => (
								<MenuItem key={key} value={key}>
									{label}
								</MenuItem>
							))}
						</Select>
					</StyledListItemBottomWrapper>

					<StyledListItemActionsWrapper>
						{HEADING_STATUS.WARNING === status && (
							<FormControlLabel
								label={__('Dismiss issue', 'pojo-accessibility')}
								control={<Checkbox color="info" />}
							/>
						)}

						<Button
							size="small"
							color="secondary"
							variant="text"
							onClick={onCancel}
							disabled={!newLevel}
						>
							{__('Cancel', 'pojo-accessibility')}
						</Button>

						<Button
							size="small"
							color="info"
							variant="contained"
							disabled={!newLevel}
						>
							{__('Apply', 'pojo-accessibility')}
						</Button>
					</StyledListItemActionsWrapper>
				</>
			)}
		</StyledTreeListItem>
	);
};

HeadingStructureHeadingTreeListItem.propTypes = {
	level: PropTypes.number.isRequired,
	content: PropTypes.string.isRequired,
	status: PropTypes.oneOf(Object.values(HEADING_STATUS)).isRequired,
};

export default HeadingStructureHeadingTreeListItem;
