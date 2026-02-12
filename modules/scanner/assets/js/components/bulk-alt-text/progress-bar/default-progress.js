import AIIcon from '@elementor/icons/AIIcon';
import Button from '@elementor/ui/Button';
import LinearProgress from '@elementor/ui/LinearProgress';
import Typography from '@elementor/ui/Typography';
import PropTypes from 'prop-types';
import PencilTickIcon from '@ea11y-apps/scanner/icons/pencil-tick-icon';
import PencilUndoIcon from '@ea11y-apps/scanner/icons/pencil-undo-icon';
import { __ } from '@wordpress/i18n';
import { StyledMainWrapperGrid, StyledActionsGrid } from './styled-components';

const DefaultProgress = ({
	completedSelectedCount,
	totalImages,
	areAllMarkedAsDecorative,
	isGenerating,
	onToggleAllDecorative,
	onGenerateAll,
	generateButtonText,
}) => {
	return (
		<StyledMainWrapperGrid container>
			<StyledActionsGrid>
				{`${completedSelectedCount}/${totalImages}`}
				<Typography variant="body2" color="text.secondary">
					ready to apply
				</Typography>
			</StyledActionsGrid>
			<LinearProgress
				value={
					totalImages > 0 ? (completedSelectedCount / totalImages) * 100 : 0
				}
				variant="determinate"
				color={completedSelectedCount > 0 ? 'success' : 'secondary'}
				sx={{ flexGrow: 1, marginInlineEnd: 5 }}
			/>
			<StyledActionsGrid>
				<Button
					color="secondary"
					variant="text"
					startIcon={
						!areAllMarkedAsDecorative ? <PencilTickIcon /> : <PencilUndoIcon />
					}
					onClick={onToggleAllDecorative}
				>
					{areAllMarkedAsDecorative
						? __('Undo Decorative', 'pojo-accessibility')
						: __('Mark all as decorative', 'pojo-accessibility')}
				</Button>
				<Button
					color="info"
					variant="outlined"
					startIcon={<AIIcon />}
					onClick={onGenerateAll}
					disabled={isGenerating}
				>
					{generateButtonText}
				</Button>
			</StyledActionsGrid>
		</StyledMainWrapperGrid>
	);
};

DefaultProgress.propTypes = {
	completedSelectedCount: PropTypes.number.isRequired,
	totalImages: PropTypes.number.isRequired,
	areAllMarkedAsDecorative: PropTypes.bool.isRequired,
	isGenerating: PropTypes.bool.isRequired,
	onToggleAllDecorative: PropTypes.func.isRequired,
	onGenerateAll: PropTypes.func.isRequired,
	generateButtonText: PropTypes.string.isRequired,
};

export default DefaultProgress;
