import PropTypes from 'prop-types';
import { useProgressBarLogic } from '@ea11y-apps/scanner/hooks/use-progress-bar-logic';
import DefaultProgress from './default-progress';
import GeneratingProgress from './generating-progress';
import SelectionModeProgress from './selection-mode-progress';

const ProgressBarContainer = ({ onGeneratingChange }) => {
	const {
		isGenerating,
		progress,
		showManualSelectionMode,
		manuallySelectedCount,
		completedSelectedCount,
		totalImages,
		areAllMarkedAsDecorative,
		handleStopGenerating,
		handleClearSelection,
		handleMarkSelectedAsDecorative,
		handleToggleAllDecorative,
		handleGenerateAll,
		generateButtonText,
	} = useProgressBarLogic(onGeneratingChange);

	if (isGenerating) {
		return (
			<GeneratingProgress progress={progress} onStop={handleStopGenerating} />
		);
	}

	if (showManualSelectionMode) {
		return (
			<SelectionModeProgress
				manuallySelectedCount={manuallySelectedCount}
				isGenerating={isGenerating}
				onClear={handleClearSelection}
				onMarkAsDecorative={handleMarkSelectedAsDecorative}
				onGenerate={handleGenerateAll}
			/>
		);
	}

	return (
		<DefaultProgress
			completedSelectedCount={completedSelectedCount}
			totalImages={totalImages}
			areAllMarkedAsDecorative={areAllMarkedAsDecorative}
			isGenerating={isGenerating}
			onToggleAllDecorative={handleToggleAllDecorative}
			onGenerateAll={handleGenerateAll}
			generateButtonText={generateButtonText}
		/>
	);
};

ProgressBarContainer.propTypes = {
	onGeneratingChange: PropTypes.func,
};

export default ProgressBarContainer;
