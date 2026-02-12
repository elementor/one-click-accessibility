import PropTypes from 'prop-types';
import { mixpanelEvents } from '@ea11y-apps/global/services/mixpanel/mixpanel-events';
import { mixpanelService } from '@ea11y-apps/global/services/mixpanel/mixpanel-service';
import { useBulkGeneration } from '@ea11y-apps/scanner/context/bulk-generation-context';
import { useScannerWizardContext } from '@ea11y-apps/scanner/context/scanner-wizard-context';
import { useEffect, useMemo } from '@wordpress/element';
import { __, sprintf } from '@wordpress/i18n';
import DefaultProgress from './default-progress';
import GeneratingProgress from './generating-progress';
import SelectionModeProgress from './selection-mode-progress';

const ProgressBarContainer = ({ onGeneratingChange }) => {
	const { sortedViolations, altTextData, setAltTextData, isManage } =
		useScannerWizardContext();
	const {
		isGenerating,
		progress,
		startBulkGeneration,
		stopBulkGeneration,
		resetProgress,
	} = useBulkGeneration();

	const altTextViolations = sortedViolations.altText;
	const type = isManage ? 'manage' : 'main';
	const totalImages = altTextViolations.length;

	const handleStopGenerating = () => {
		mixpanelService.sendEvent(mixpanelEvents.stopButtonClicked);
		stopBulkGeneration();
	};

	useEffect(() => {
		if (onGeneratingChange) {
			onGeneratingChange(isGenerating, handleStopGenerating);
		}
	}, [isGenerating, onGeneratingChange]);

	useEffect(() => {
		return () => {
			resetProgress();
		};
	}, [resetProgress]);

	const {
		manuallySelectedCount,
		completedSelectedCount,
		areAllMarkedAsDecorative,
	} = useMemo(() => {
		let manuallySelected = 0;
		let completedSelected = 0;
		let allDecorative = true;

		altTextViolations.forEach((item, index) => {
			const itemData = altTextData?.[type]?.[index];
			const isSelected = itemData?.selected === true;
			const isDecorative = itemData?.makeDecorative === true;
			const hasValidAlt = itemData?.hasValidAltText === true;

			if (isSelected && !hasValidAlt) {
				manuallySelected++;
			}

			if (isSelected && hasValidAlt) {
				completedSelected++;
			}

			if (!isDecorative) {
				allDecorative = false;
			}
		});

		return {
			manuallySelectedCount: manuallySelected,
			completedSelectedCount: completedSelected,
			areAllMarkedAsDecorative: allDecorative,
		};
	}, [altTextViolations, altTextData, type]);

	const showManualSelectionMode = manuallySelectedCount > 0;

	const handleClearSelection = () => {
		const updatedData = [...(altTextData?.[type] || [])];

		altTextViolations.forEach((item, index) => {
			if (
				altTextData?.[type]?.[index]?.selected &&
				!altTextData?.[type]?.[index]?.hasValidAltText
			) {
				updatedData[index] = {
					...(updatedData[index] || {}),
					selected: false,
				};
			}
		});

		setAltTextData({
			...altTextData,
			[type]: updatedData,
		});
	};

	const handleMarkSelectedAsDecorative = () => {
		const updatedData = [...(altTextData?.[type] || [])];

		altTextViolations.forEach((item, index) => {
			if (
				altTextData?.[type]?.[index]?.selected &&
				!altTextData?.[type]?.[index]?.hasValidAltText
			) {
				updatedData[index] = {
					...(updatedData[index] || {}),
					makeDecorative: true,
					hasValidAltText: true,
					isDraft: false,
					altText: '',
					apiId: null,
					resolved: false,
				};
			}
		});

		setAltTextData({
			...altTextData,
			[type]: updatedData,
		});
	};

	const handleToggleAllDecorative = () => {
		const updatedData = [...(altTextData?.[type] || [])];
		const isMarking = !areAllMarkedAsDecorative;

		altTextViolations.forEach((item, index) => {
			if (isMarking) {
				updatedData[index] = {
					...(updatedData[index] || {}),
					makeDecorative: true,
					selected: true,
					hasValidAltText: true,
					apiId: null,
					resolved: false,
				};
			} else {
				const currentAltText = updatedData[index]?.altText?.trim();
				const hasAltText = !!currentAltText;

				updatedData[index] = {
					...(updatedData[index] || {}),
					makeDecorative: false,
					selected: hasAltText,
					hasValidAltText: hasAltText,
					apiId: null,
					resolved: false,
				};
			}
		});

		setAltTextData({
			...altTextData,
			[type]: updatedData,
		});
	};

	const handleGenerateAll = () => {
		const hasManuallySelectedItems = altTextViolations.some(
			(item, index) =>
				altTextData?.[type]?.[index]?.selected === true &&
				!altTextData?.[type]?.[index]?.hasValidAltText,
		);

		const cardIndicesToProcess = [];
		altTextViolations.forEach((item, index) => {
			const itemData = altTextData?.[type]?.[index];
			const isMarkedDecorative = itemData?.makeDecorative;
			const hasValidAlt = itemData?.hasValidAltText;

			if (isMarkedDecorative || hasValidAlt) {
				return;
			}

			const shouldInclude = hasManuallySelectedItems
				? itemData?.selected === true
				: true;
			if (shouldInclude) {
				cardIndicesToProcess.push(index);
			}
		});

		startBulkGeneration(cardIndicesToProcess);
	};

	const getGenerateButtonText = () => {
		if (isGenerating) {
			return __('Generating…', 'pojo-accessibility');
		}
		if (manuallySelectedCount > 0) {
			return sprintf(
				// Translators: %d number of images to generate
				__('Generate (%d)', 'pojo-accessibility'),
				manuallySelectedCount,
			);
		}
		return __('Generate all', 'pojo-accessibility');
	};

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
			generateButtonText={getGenerateButtonText()}
		/>
	);
};

ProgressBarContainer.propTypes = {
	onGeneratingChange: PropTypes.func,
};

export default ProgressBarContainer;
