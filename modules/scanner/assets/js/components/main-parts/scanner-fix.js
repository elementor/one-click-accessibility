import InfoCircleIcon from '@elementor/icons/InfoCircleIcon';
import Box from '@elementor/ui/Box';
import Infotip from '@elementor/ui/Infotip';
import Typography from '@elementor/ui/Typography';
import { BlockButton } from '@ea11y-apps/scanner/components/block-button';
import { useScannerWizardContext } from '@ea11y-apps/scanner/context/scanner-wizard-context';
import { BLOCK_TITLES, BLOCKS } from '@ea11y-apps/scanner/utils/constants';
import { __ } from '@wordpress/i18n';

export const ScannerFix = () => {
	const { sortedViolations } = useScannerWizardContext();
	const scannerFixExist = sortedViolations.altText.length > 0;

	return scannerFixExist ? (
		<Box>
			<Box display="flex" alignItems="center" gap={1} sx={{ mb: 1 }}>
				<Typography variant="body2">
					{__('Fix in scanner', 'pojo-accessibility')}
				</Typography>

				<Infotip
					content={
						<Typography variant="body2" sx={{ p: 2, maxWidth: '300px' }}>
							{__('Some info', 'pojo-accessibility')}
						</Typography>
					}
					PopperProps={{
						disablePortal: true,
					}}
				>
					<InfoCircleIcon fontSize="small" />
				</Infotip>
			</Box>
			<BlockButton
				title={BLOCK_TITLES.altText}
				count={sortedViolations.altText.length}
				block={BLOCKS.altText}
			/>
		</Box>
	) : null;
};
