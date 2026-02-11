import AIIcon from '@elementor/icons/AIIcon';
import Alert from '@elementor/ui/Alert';
import AlertTitle from '@elementor/ui/AlertTitle';
import Button from '@elementor/ui/Button';
import Grid from '@elementor/ui/Grid';
import LinearProgress from '@elementor/ui/LinearProgress';
import Typography from '@elementor/ui/Typography';
import { styled } from '@elementor/ui/styles';
import PropTypes from 'prop-types';
import { useToastNotification } from '@ea11y-apps/global/hooks';
import { mixpanelEvents } from '@ea11y-apps/global/services/mixpanel/mixpanel-events';
import { mixpanelService } from '@ea11y-apps/global/services/mixpanel/mixpanel-service';
import { useScannerWizardContext } from '@ea11y-apps/scanner/context/scanner-wizard-context';
import { generateAiAltText } from '@ea11y-apps/scanner/hooks/use-alt-text-form';
import PencilTickIcon from '@ea11y-apps/scanner/icons/pencil-tick-icon';
import PencilUndoIcon from '@ea11y-apps/scanner/icons/pencil-undo-icon';
import PlayerStopIcon from '@ea11y-apps/scanner/icons/player-stop-icon';
import {
	useState,
	useRef,
	useEffect,
	useMemo,
	useCallback,
} from '@wordpress/element';
import { __, sprintf, _n } from '@wordpress/i18n';

const BulkAltTextProgress = ({ onGeneratingChange }) => {
	const { sortedViolations, altTextData, setAltTextData, isManage } =
		useScannerWizardContext();
	const { success, error } = useToastNotification();
	const [generatingAll, setGeneratingAll] = useState(false);
	const [generatingProgress, setGeneratingProgress] = useState({
		current: 0,
		total: 0,
	});
	const abortControllerRef = useRef(null);
	const shouldCancelRef = useRef(false);
	const altTextViolations = sortedViolations.altText;
	const type = isManage ? 'manage' : 'main';

	const handleStopGenerating = useCallback(() => {
		mixpanelService.sendEvent(mixpanelEvents.stopButtonClicked);
		shouldCancelRef.current = true;
		if (abortControllerRef.current) {
			abortControllerRef.current.abort();
		}
	}, []);

	useEffect(() => {
		return () => {
			if (abortControllerRef.current) {
				abortControllerRef.current.abort();
			}
			shouldCancelRef.current = false;
		};
	}, []);

	useEffect(() => {
		if (onGeneratingChange) {
			onGeneratingChange(generatingAll, handleStopGenerating);
		}
	}, [generatingAll, onGeneratingChange, handleStopGenerating]);

	const totalImages = altTextViolations.length;

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

		altTextViolations.forEach((item, index) => {
			updatedData[index] = {
				...(updatedData[index] || {}),
				makeDecorative: !areAllMarkedAsDecorative,
				selected: !areAllMarkedAsDecorative,
				hasValidAltText: !areAllMarkedAsDecorative,
				apiId: null,
				resolved: false,
			};
		});

		setAltTextData({
			...altTextData,
			[type]: updatedData,
		});
	};

	const handleGenerateAll = async () => {
		setGeneratingAll(true);
		shouldCancelRef.current = false;
		abortControllerRef.current = new AbortController();

		const updatedData = [...(altTextData?.[type] || [])];
		let successCount = 0;
		let errorCount = 0;

		const hasSelectedItems = altTextViolations.some(
			(item, index) => altTextData?.[type]?.[index]?.selected === true,
		);

		const itemsToProcess = altTextViolations.filter((item, index) => {
			const itemData = altTextData?.[type]?.[index];
			const isMarkedDecorative = itemData?.makeDecorative;
			const hasValidAlt = itemData?.hasValidAltText;

			if (isMarkedDecorative || hasValidAlt) {
				return false;
			}
			return hasSelectedItems ? itemData?.selected === true : true;
		});

		setGeneratingProgress({ current: 0, total: itemsToProcess.length });

		try {
			for (let i = 0; i < altTextViolations.length; i++) {
				if (shouldCancelRef.current) {
					break;
				}

				const item = altTextViolations[i];
				const itemData = altTextData?.[type]?.[i];
				const isMarkedDecorative = itemData?.makeDecorative;
				const hasValidAlt = itemData?.hasValidAltText;

				if (isMarkedDecorative || hasValidAlt) {
					continue;
				}

				const shouldProcess = hasSelectedItems
					? itemData?.selected === true
					: true;

				if (shouldProcess) {
					try {
						const aiData = await generateAiAltText(
							item,
							abortControllerRef.current?.signal,
						);

						if (shouldCancelRef.current) {
							break;
						}
						updatedData[i] = {
							...(updatedData[i] || {}),
							...aiData,
							selected: updatedData[i]?.selected || false,
							resolved: false,
							hasValidAltText: true,
							isDraft: false,
						};
						successCount++;
						setGeneratingProgress({
							current: successCount,
							total: itemsToProcess.length,
						});
					} catch (e) {
						if (!shouldCancelRef.current) {
							console.error(`Failed to generate AI text for item ${i}:`, e);
							errorCount++;
						}
					}
				}
			}

			setAltTextData({
				...altTextData,
				[type]: updatedData,
			});

			if (shouldCancelRef.current && successCount > 0) {
				success(
					sprintf(
						// Translators: %d number of descriptions generated before cancellation
						_n(
							'%d AI description generated before stopping.',
							'%d AI descriptions generated before stopping.',
							successCount,
							'pojo-accessibility',
						),
						successCount,
					),
				);
			} else if (successCount > 0 && errorCount === 0) {
				success(
					sprintf(
						// Translators: %d number of descriptions generated
						_n(
							'%d AI description generated!',
							'%d AI descriptions generated!',
							successCount,
							'pojo-accessibility',
						),
						successCount,
					),
				);
			} else if (successCount > 0 && errorCount > 0) {
				success(
					sprintf(
						// Translators: %1$d successful count, %2$d failed count
						__(
							'%1$d descriptions generated, %2$d failed.',
							'pojo-accessibility',
						),
						successCount,
						errorCount,
					),
				);
			} else if (errorCount > 0) {
				error(
					__(
						'Failed to generate AI descriptions. Please try again.',
						'pojo-accessibility',
					),
				);
			}
		} catch (e) {
			console.error(e);
			error(
				__(
					'An error occurred while generating descriptions.',
					'pojo-accessibility',
				),
			);
		} finally {
			setGeneratingAll(false);
			setGeneratingProgress({ current: 0, total: 0 });
			shouldCancelRef.current = false;
			abortControllerRef.current = null;
		}
	};

	const getGenerateButtonText = () => {
		if (generatingAll) {
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

	if (generatingAll) {
		return (
			<>
				<LinearProgress
					value={
						generatingProgress.total > 0
							? (generatingProgress.current / generatingProgress.total) * 100
							: 0
					}
					variant="determinate"
					color="info"
					sx={{ flexGrow: 1 }}
				/>
				<Alert
					severity="info"
					variant="standard"
					icon={false}
					secondaryAction={
						<Typography variant="body2" color="text.secondary">
							{sprintf(
								// Translators: %1$d current count, %2$d total count
								__('%1$d/%2$d completed', 'pojo-accessibility'),
								generatingProgress.current,
								generatingProgress.total,
							)}
						</Typography>
					}
					action={
						<Button
							color="info"
							variant="outlined"
							size="small"
							onClick={handleStopGenerating}
							startIcon={<PlayerStopIcon />}
						>
							{__('Stop', 'pojo-accessibility')}
						</Button>
					}
				>
					<AlertTitle>
						{__('Generating alt text for images…', 'pojo-accessibility')}
					</AlertTitle>
				</Alert>
			</>
		);
	}

	if (showManualSelectionMode) {
		return (
			<>
				<StyledMainWrapperGrid container bgcolor="divider">
					<StyledActionsGrid>
						<Typography variant="h6" color="text.primary">
							{sprintf(
								// Translators: %d number of selected items
								__('%d selected', 'pojo-accessibility'),
								manuallySelectedCount,
							)}
						</Typography>
						<Button
							size="small"
							variant="text"
							color="secondary"
							onClick={handleClearSelection}
						>
							{__('Clear', 'pojo-accessibility')}
						</Button>
					</StyledActionsGrid>
					<StyledActionsGrid>
						<Button
							color="secondary"
							variant="text"
							startIcon={<PencilTickIcon />}
							onClick={handleMarkSelectedAsDecorative}
						>
							{__('Mark as decorative', 'pojo-accessibility')}
						</Button>
						<Button
							color="info"
							variant="outlined"
							startIcon={<AIIcon />}
							onClick={handleGenerateAll}
							disabled={generatingAll}
						>
							{__('Generate', 'pojo-accessibility')}
						</Button>
					</StyledActionsGrid>
				</StyledMainWrapperGrid>
			</>
		);
	}

	return (
		<>
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
					sx={{ flexGrow: 1 }}
				/>
				<StyledActionsGrid>
					<Button
						color="secondary"
						variant="text"
						startIcon={
							!areAllMarkedAsDecorative ? (
								<PencilTickIcon />
							) : (
								<PencilUndoIcon />
							)
						}
						onClick={handleToggleAllDecorative}
					>
						{areAllMarkedAsDecorative
							? __('Undo Decorative', 'pojo-accessibility')
							: __('Mark all as decorative', 'pojo-accessibility')}
					</Button>
					<Button
						color="info"
						variant="outlined"
						startIcon={<AIIcon />}
						onClick={handleGenerateAll}
						disabled={generatingAll}
					>
						{getGenerateButtonText()}
					</Button>
				</StyledActionsGrid>
			</StyledMainWrapperGrid>
		</>
	);
};

BulkAltTextProgress.propTypes = {
	onGeneratingChange: PropTypes.func,
};

export default BulkAltTextProgress;

const StyledMainWrapperGrid = styled(Grid)(({ theme }) => ({
	display: 'flex',
	flexDirection: 'row',
	alignItems: 'center',
	justifyContent: 'space-between',
	flexWrap: 'nowrap',
	gap: theme.spacing(1),
	padding: theme.spacing(2),
	width: '100%',
}));

const StyledActionsGrid = styled(Grid)(({ theme }) => ({
	display: 'flex',
	flexDirection: 'row',
	flexWrap: 'nowrap',
	gap: theme.spacing(1),
	width: 'auto',
}));
