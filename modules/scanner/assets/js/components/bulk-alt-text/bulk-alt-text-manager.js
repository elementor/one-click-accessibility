import Button from '@elementor/ui/Button';
import Dialog from '@elementor/ui/Dialog';
import DialogActions from '@elementor/ui/DialogActions';
import DialogContent from '@elementor/ui/DialogContent';
import DialogHeader from '@elementor/ui/DialogHeader';
import DialogTitle from '@elementor/ui/DialogTitle';
import Divider from '@elementor/ui/Divider';
import PropTypes from 'prop-types';
import { useToastNotification } from '@ea11y-apps/global/hooks';
import BulkAltTextProgress from '@ea11y-apps/scanner/components/bulk-alt-text/bulk-alt-text-progress';
import ConfirmCloseDialog from '@ea11y-apps/scanner/components/bulk-alt-text/confirm-close-dialog';
import ConfirmStopGenerationDialog from '@ea11y-apps/scanner/components/bulk-alt-text/confirm-stop-generation-dialog';
import ImageGrid from '@ea11y-apps/scanner/components/bulk-alt-text/image-grid';
import { useScannerWizardContext } from '@ea11y-apps/scanner/context/scanner-wizard-context';
import WandIcon from '@ea11y-apps/scanner/icons/wand-icon';
import { submitAltTextRemediation } from '@ea11y-apps/scanner/utils/submit-alt-text';
import { useState } from '@wordpress/element';
import { __ } from '@wordpress/i18n';

const BulkAltTextManager = ({ open, close }) => {
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
	const [stopGenerationFn, setStopGenerationFn] = useState(null);

	const altTextViolations = sortedViolations.altText;
	const type = isManage ? 'manage' : 'main';

	const selectedItems = altTextViolations.filter(
		(item, index) => altTextData?.[type]?.[index]?.selected === true,
	);

	const hasUnsavedChanges = selectedItems.length > 0;

	const handleClose = () => {
		if (isGenerating) {
			setShowStopGenerationDialog(true);
		} else if (hasUnsavedChanges && !loading) {
			setShowConfirmDialog(true);
		} else {
			close();
		}
	};

	const handleLeaveWhileGenerating = () => {
		// Stop the generation process
		if (stopGenerationFn) {
			stopGenerationFn();
		}
		setShowStopGenerationDialog(false);
		close();
	};

	const handleKeepGenerating = () => {
		setShowStopGenerationDialog(false);
	};

	const handleGeneratingChange = (generating, stopFn) => {
		setIsGenerating(generating);
		if (stopFn) {
			setStopGenerationFn(() => stopFn);
		}
	};

	const handleDiscard = () => {
		setShowConfirmDialog(false);
		close();
	};

	const handleApply = async (closeAfter = false) => {
		setLoading(true);
		let successCount = 0;
		let errorCount = 0;
		const updatedData = [...(altTextData?.[type] || [])];

		try {
			for (let i = 0; i < altTextViolations.length; i++) {
				const item = altTextViolations[i];
				if (altTextData?.[type]?.[i]?.selected) {
					try {
						const remediation = await submitAltTextRemediation({
							item,
							altText: altTextData?.[type]?.[i]?.altText || '',
							makeDecorative: altTextData?.[type]?.[i]?.makeDecorative || false,
							isGlobal:
								altTextData?.[type]?.[i]?.isGlobal || item.global || false,
							apiId: altTextData?.[type]?.[i]?.apiId,
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
			}

			setAltTextData({
				...altTextData,
				[type]: updatedData,
			});

			setResolved(resolved + successCount);

			if (successCount > 0 && errorCount === 0) {
				success(
					__('All selected items applied successfully!', 'pojo-accessibility'),
				);
				setShowConfirmDialog(false);
				close();
			} else if (successCount > 0 && errorCount > 0) {
				success(
					`${successCount} ${__('items applied successfully.', 'pojo-accessibility')} ${errorCount} ${__('items failed.', 'pojo-accessibility')}`,
				);
				if (closeAfter) {
					setShowConfirmDialog(false);
					close();
				}
			} else if (errorCount > 0) {
				error(
					__('Failed to apply items. Please try again.', 'pojo-accessibility'),
				);
			}
		} catch (e) {
			console.error(e);
			error(
				__('An error occurred while applying changes.', 'pojo-accessibility'),
			);
		} finally {
			setLoading(false);
		}
	};

	const handleApplyAndClose = () => {
		handleApply(true);
	};

	return (
		<>
			<Dialog
				open={open}
				aria-labelledby="Bulk Alt Text Manager"
				aria-describedby="Edit alt text for the images in bulk"
				disablePortal
				maxWidth="lg"
				fullWidth
			>
				<DialogHeader onClose={handleClose} logo={<WandIcon />}>
					<DialogTitle>
						{__('Alt Text Manager', 'pojo-accessibility')}
					</DialogTitle>
				</DialogHeader>

				<DialogContent dividers sx={{ padding: 0 }}>
					<BulkAltTextProgress onGeneratingChange={handleGeneratingChange} />
					<Divider />
					<ImageGrid />
				</DialogContent>

				<DialogActions>
					<Button onClick={handleClose} color="secondary" disabled={loading}>
						{__('Cancel', 'pojo-accessibility')}
					</Button>
					<Button
						onClick={() => handleApply(false)}
						variant="contained"
						disabled={loading || selectedItems.length === 0}
					>
						{loading
							? __('Applying…', 'pojo-accessibility')
							: __('Apply', 'pojo-accessibility')}
					</Button>
				</DialogActions>
			</Dialog>

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
