import AlertOctagonFilledIcon from '@elementor/icons/AlertOctagonFilledIcon';
import AlertTriangleFilledIcon from '@elementor/icons/AlertTriangleFilledIcon';
import Tooltip from '@elementor/ui/Tooltip';
import { useSettings } from '@ea11y/hooks';
import { __ } from '@wordpress/i18n';

const QuotaIndicator = () => {
	const { planData, openSidebar } = useSettings();

	if (!planData?.scannedPages || !planData?.aiCredits) {
		return null; // Return null if data is not available
	}

	const { scannedPages, aiCredits } = planData;

	// calculate usage data of each quota
	const scannedPagesUsage = Math.round(
		(scannedPages.used / scannedPages.allowed) * 100,
	);
	const aiCreditsUsage = Math.round((aiCredits.used / aiCredits.allowed) * 100);

	// check if any of the quota is 100% used
	const isQuotaExceeded = scannedPagesUsage >= 100 || aiCreditsUsage >= 100;

	// check if any of the quota is 80% but not 100% used
	const isQuotaWarning =
		(scannedPagesUsage >= 80 && scannedPagesUsage < 100) ||
		(aiCreditsUsage >= 80 && aiCreditsUsage < 100);

	if (isQuotaExceeded) {
		return (
			<Tooltip
				title={__('You’re reached your plan’s limit', 'pojo-accessibility')}
			>
				<AlertOctagonFilledIcon sx={{ color: 'error.dark' }} fontSize="16px" />
			</Tooltip>
		);
	}

	if (isQuotaWarning) {
		return (
			<Tooltip
				title={__('You’re nearing your plan’s limit', 'pojo-accessibility')}
			>
				<AlertTriangleFilledIcon
					sx={{
						color: 'warning.light',
						justifySelf: !openSidebar ? 'right' : 'auto',
						alignSelf: !openSidebar ? 'start' : 'auto',
						fontSize: !openSidebar ? '16px' : 'inherit',
						position: !openSidebar ? 'absolute' : 'relative',
						top: !openSidebar ? '0' : '0',
						right: !openSidebar ? '10px' : 'auto',
					}}
				/>
			</Tooltip>
		);
	}

	return null;
};

export default QuotaIndicator;
