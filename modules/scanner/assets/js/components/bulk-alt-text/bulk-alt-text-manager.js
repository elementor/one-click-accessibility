import Button from '@elementor/ui/Button';
import Dialog from '@elementor/ui/Dialog';
import DialogActions from '@elementor/ui/DialogActions';
import DialogContent from '@elementor/ui/DialogContent';
import DialogHeader from '@elementor/ui/DialogHeader';
import DialogTitle from '@elementor/ui/DialogTitle';
import Divider from '@elementor/ui/Divider';
import { FocusTrap } from 'focus-trap-react';
import PropTypes from 'prop-types';
import { useToastNotification } from '@ea11y-apps/global/hooks';
import { mixpanelEvents, mixpanelService } from '@ea11y-apps/global/services';
import ConfirmCloseDialog from '@ea11y-apps/scanner/components/bulk-alt-text/confirm-close-dialog';
import ConfirmStopGenerationDialog from '@ea11y-apps/scanner/components/bulk-alt-text/confirm-stop-generation-dialog';
import ImageGrid from '@ea11y-apps/scanner/components/bulk-alt-text/image-grid';
import BulkAltTextProgress from '@ea11y-apps/scanner/components/bulk-alt-text/progress-bar';
import QuotaErrorAlert from '@ea11y-apps/scanner/components/bulk-alt-text/quota-error-alert';
import { BLOCKS } from '@ea11y-apps/scanner/constants';
import { BulkGenerationProvider } from '@ea11y-apps/scanner/context/bulk-generation-context';
import { useScannerWizardContext } from '@ea11y-apps/scanner/context/scanner-wizard-context';
import usePreventAriaHidden from '@ea11y-apps/scanner/hooks/use-prevent-aria-hidden';
import WandIcon from '@ea11y-apps/scanner/icons/wand-icon';
import { submitAltTextRemediation } from '@ea11y-apps/scanner/utils/submit-alt-text';
import { speak } from '@wordpress/a11y';
import { useState, useCallback, useRef, useMemo } from '@wordpress/element';
import { __, sprintf } from '@wordpress/i18n';

const BulkAltTextManager = ({ open, close }) => {
	usePreventAriaHidden(open);

	const { success, error } = useToastNotification();
	const {
		sortedViolations,
		altTextData,
		setAltTextData,
		resolved,
		setResolved,
		currentScanId,
		updateRemediationList,
		isManage,
	} = useScannerWizardContext();
	const [loading, setLoading] = useState(false);
	const [showConfirmDialog, setShowConfirmDialog] = useState(false);
	const [showStopGenerationDialog, setShowStopGenerationDialog] =
		useState(false);
	const [isGenerating, setIsGenerating] = useState(false);
	const stopGenerationFnRef = useRef(null);
	const altTextViolations = sortedViolations.altText;
	const type = isManage ? 'manage' : 'main';

	const selectedItemsCount = useMemo(() => {
		let count = 0;
		for (let i = 0; i < altTextViolations.length; i++) {
			const itemData = altTextData?.[type]?.[i];
			if (itemData?.selected === true && itemData?.hasValidAltText === true) {
				count++;
			}
		}
		return count;
	}, [altTextViolations, altTextData, type]);

	const hasUnsavedChanges = selectedItemsCount > 0;

	const handleClose = () => {
		mixpanelService.sendEvent(mixpanelEvents.popupButtonClicked, {
			popupType: 'bulk_alt_text',
			buttonName: 'x_button',
		});
		if (isGenerating) {
			setShowStopGenerationDialog(true);
		} else if (hasUnsavedChanges && !loading) {
			setShowConfirmDialog(true);
		} else {
			close();
		}
	};

	const handleLeaveWhileGenerating = () => {
		mixpanelService.sendEvent(mixpanelEvents.popupButtonClicked, {
			popupType: 'bulk_alt_text',
			buttonName: 'Leave without generating',
		});
		if (stopGenerationFnRef.current) {
			stopGenerationFnRef.current();
		}
		setShowStopGenerationDialog(false);
		close();
	};

	const handleKeepGenerating = () => {
		setShowStopGenerationDialog(false);
	};

	const handleGeneratingChange = useCallback((generating, stopFn) => {
		setIsGenerating(generating);
		stopGenerationFnRef.current = stopFn;
	}, []);

	const handleDiscard = () => {
		mixpanelService.sendEvent(mixpanelEvents.popupButtonClicked, {
			popupType: 'bulk_alt_text',
			buttonName: 'Discard changes',
		});
		setShowConfirmDialog(false);
		close();
	};

	const handleApply = async (
		closeAfter = false,
		source = 'bulk_main_action',
	) => {
		setLoading(true);
		let successCount = 0;
		let errorCount = 0;
		const updatedData = [...(altTextData?.[type] || [])];

		try {
			for (let i = 0; i < altTextViolations.length; i++) {
				const item = altTextViolations[i];
				const itemData = altTextData?.[type]?.[i];

				if (!itemData?.selected || !itemData?.hasValidAltText) {
					continue;
				}

				const isDecorative = itemData.makeDecorative || false;
				if (!isDecorative && !itemData.altText?.trim()) {
					console.warn(`Skipping item ${i}: No alt text provided`);
					errorCount++;
					continue;
				}

				try {
					const remediation = await submitAltTextRemediation({
						item,
						altText: itemData.altText || '',
						makeDecorative: isDecorative,
						isGlobal: itemData.isGlobal || item.global || false,
						apiId: itemData.apiId,
						currentScanId,
						updateRemediationList,
					});
					updatedData[i] = {
						...(updatedData[i] || {}),
						remediation,
						resolved: true,
					};
					successCount++;
				} catch (e) {
					errorCount++;
					console.error(`Failed to submit item ${i}:`, e);
				}
			}

			setAltTextData({
				...altTextData,
				[type]: updatedData,
			});

			setResolved(resolved + successCount);

			// Send mixpanel event for successful submissions
			if (successCount > 0) {
				mixpanelService.sendEvent(mixpanelEvents.applyFixButtonClicked, {
					fix_method: 'Bulk Alt Text',
					source,
					num_of_images: successCount,
					category_name: BLOCKS.altText,
					page_url: window.ea11yScannerData?.pageData?.url,
					is_global: 'no',
				});
			}

			if (successCount > 0 && errorCount === 0) {
				const message = __(
					'All selected items applied successfully!',
					'pojo-accessibility',
				);
				success(message);
				speak(message, 'assertive');
				setShowConfirmDialog(false);
				close();
			} else if (successCount > 0 && errorCount > 0) {
				const message = sprintf(
					// Translators: %1$d successful count, %2$d failed count
					__(
						'%1$d items applied successfully. %2$d items failed.',
						'pojo-accessibility',
					),
					successCount,
					errorCount,
				);
				success(message);
				speak(message, 'assertive');
				if (closeAfter) {
					setShowConfirmDialog(false);
					close();
				}
			} else if (errorCount > 0) {
				const message = __(
					'Failed to apply items. Please try again.',
					'pojo-accessibility',
				);
				error(message);
				speak(message, 'assertive');
			}
		} catch (e) {
			console.error(e);
			const message = __(
				'An error occurred while applying changes.',
				'pojo-accessibility',
			);
			error(message);
			speak(message, 'assertive');
		} finally {
			setLoading(false);
		}
	};

	const handleApplyAndClose = () => {
		handleApply(true, 'bulk_close_popup');
	};

	return (
		<>
			<FocusTrap
				active={open}
				focusTrapOptions={{
					allowOutsideClick: true,
					escapeDeactivates: false,
					returnFocusOnDeactivate: true,
				}}
			>
				<div>
					<BulkGenerationProvider>
						<Dialog
							open={open}
							onClose={isGenerating ? false : handleClose}
							aria-labelledby="bulk-alt-text-manager-title"
							disablePortal
							fullWidth={false}
							maxWidth="lg"
							PaperProps={{
								sx: {
									borderRadius: 3,
								},
							}}
							sx={{
								maxWidth: '1200px',
								margin: 'auto',
							}}
						>
							<DialogHeader
								onClose={isGenerating ? false : handleClose}
								logo={<WandIcon fontSize="small" />}
							>
								<DialogTitle id="bulk-alt-text-manager-title">
									{__('Alt Text Manager', 'pojo-accessibility')}
								</DialogTitle>
							</DialogHeader>

							<DialogContent dividers sx={{ padding: 0 }}>
								<BulkAltTextProgress
									onGeneratingChange={handleGeneratingChange}
								/>
								<Divider />
								<QuotaErrorAlert />
								<ImageGrid />
							</DialogContent>

							<DialogActions>
								<Button
									onClick={handleClose}
									color="secondary"
									disabled={loading || isGenerating}
								>
									{__('Cancel', 'pojo-accessibility')}
								</Button>
								<Button
									onClick={() => handleApply(false)}
									variant="contained"
									disabled={loading || selectedItemsCount === 0 || isGenerating}
								>
									{loading
										? __('Applying…', 'pojo-accessibility')
										: __('Apply', 'pojo-accessibility')}
								</Button>
							</DialogActions>
						</Dialog>
					</BulkGenerationProvider>
				</div>
			</FocusTrap>

			<ConfirmStopGenerationDialog
				open={showStopGenerationDialog}
				onKeepGenerating={handleKeepGenerating}
				onLeave={handleLeaveWhileGenerating}
			/>

			<ConfirmCloseDialog
				open={showConfirmDialog}
				onDiscard={handleDiscard}
				onApply={handleApplyAndClose}
				onCancel={() => setShowConfirmDialog(false)}
				loading={loading}
			/>
		</>
	);
};

BulkAltTextManager.propTypes = {
	open: PropTypes.bool.isRequired,
	close: PropTypes.func.isRequired,
};

export default BulkAltTextManager;
