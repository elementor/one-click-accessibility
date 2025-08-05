import MinusIcon from '@elementor/icons/MinusIcon';
import PlusIcon from '@elementor/icons/PlusIcon';
import Box from '@elementor/ui/Box';
import IconButton from '@elementor/ui/IconButton';
import Tooltip from '@elementor/ui/Tooltip';
import Typography from '@elementor/ui/Typography';
import { styled } from '@elementor/ui/styles';
import PropTypes from 'prop-types';
import { mixpanelEvents, mixpanelService } from '@ea11y-apps/global/services';
import { COLOR_CONTRAST_SELECTORS_COUNT } from '@ea11y-apps/scanner/constants';
import { useEffect } from '@wordpress/element';
import { __ } from '@wordpress/i18n';

export const ParentSelector = ({
	parents,
	setParentSmaller,
	setParentLarger,
}) => {
	useEffect(() => {
		mixpanelService.sendEvent(mixpanelEvents.backgroundAdaptorTriggered);
	}, []);

	const selected = Math.max(0, COLOR_CONTRAST_SELECTORS_COUNT - parents.length);
	const smallerEnabled = parents.length > 1;
	const biggerEnabled = parents.length > 0 && parents.at(-1) !== '/html';

	return (
		<Box>
			<Typography variant="body2" as="p" sx={{ mb: 2 }}>
				{__('Background area', 'pojo-accessibility')}
			</Typography>
			<Box display="flex" alignItems="center" gap={1}>
				<Tooltip
					arrow
					placement="top"
					title={__('Apply to a smaller area', 'pojo-accessibility')}
					PopperProps={{
						disablePortal: true,
					}}
				>
					{smallerEnabled ? (
						<IconButton onClick={setParentSmaller}>
							<MinusIcon />
						</IconButton>
					) : (
						<MinusIcon color="disabled" sx={{ px: 1 }} />
					)}
				</Tooltip>
				<ParentIndicator>
					{[...Array(COLOR_CONTRAST_SELECTORS_COUNT)].map((_, i) => {
						const size = 16 + (COLOR_CONTRAST_SELECTORS_COUNT - 1 - i) * 16;
						const filled = i === selected;
						return <Square key={i} size={size} filled={filled} />;
					})}
				</ParentIndicator>
				<Tooltip
					arrow
					placement="top"
					title={__('Apply to a larger area', 'pojo-accessibility')}
					PopperProps={{
						disablePortal: true,
					}}
				>
					{biggerEnabled ? (
						<IconButton onClick={setParentLarger}>
							<PlusIcon />
						</IconButton>
					) : (
						<PlusIcon color="disabled" sx={{ px: 1 }} />
					)}
				</Tooltip>
			</Box>
		</Box>
	);
};

const ParentIndicator = styled(Box)`
	position: relative;
	width: 80px;
	height: 80px;
	display: flex;
	align-items: center;
	justify-content: center;
`;

const Square = styled(Box)`
	position: absolute;
	width: ${({ size }) => size}px;
	height: ${({ size }) => size}px;
	box-sizing: border-box;
	border: ${({ filled }) => (filled ? '1px solid #000' : '1px dashed #000')};
	background-color: ${({ filled }) => (filled ? '#93C5FD' : 'transparent')};
`;

ParentSelector.propTypes = {
	parents: PropTypes.arrayOf(PropTypes.string).isRequired,
	setParentSmaller: PropTypes.func.isRequired,
	setParentLarger: PropTypes.func.isRequired,
};
