import { ManagementStats } from '@ea11y-apps/scanner/components/header/stats/management-stats';
import { ScanStats } from '@ea11y-apps/scanner/components/header/stats/scan-stats';
import { BLOCKS } from '@ea11y-apps/scanner/constants';
import { useScannerWizardContext } from '@ea11y-apps/scanner/context/scanner-wizard-context';

const Stats = () => {
	const { openedBlock } = useScannerWizardContext();

	switch (openedBlock) {
		case BLOCKS.main:
			return <ScanStats />;
		case BLOCKS.management:
			return <ManagementStats />;
		default:
			return false;
	}
};

export default Stats;
