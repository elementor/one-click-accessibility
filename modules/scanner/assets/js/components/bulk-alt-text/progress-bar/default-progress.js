import Button from '@elementor/ui/Button';
import LinearProgress from '@elementor/ui/LinearProgress';
import Typography from '@elementor/ui/Typography';
import PropTypes from 'prop-types';
import PencilTickIcon from '@ea11y-apps/scanner/icons/pencil-tick-icon';
import PencilUndoIcon from '@ea11y-apps/scanner/icons/pencil-undo-icon';
import { __ } from '@wordpress/i18n';
import GenerateAllButton from './generate-all-button';
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
		<StyledMainWrapperGrid bgcolor="background.paper" container>
			<StyledActionsGrid>
				<Typography variant="body2" color="text.secondary">
					{`${completedSelectedCount}/${totalImages}`}{' '}
					{__('ready to apply', 'pojo-accessibility')}
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
						!areAllMarkedAsDecorative ? (
							<PencilTickIcon size="small" />
						) : (
							<PencilUndoIcon size="small" />
						)
					}
					onClick={onToggleAllDecorative}
				>
					{areAllMarkedAsDecorative
						? __('Undo Decorative', 'pojo-accessibility')
						: __('Mark all as decorative', 'pojo-accessibility')}
				</Button>
				<GenerateAllButton
					onClick={onGenerateAll}
					disabled={isGenerating}
					text={generateButtonText}
				/>
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
