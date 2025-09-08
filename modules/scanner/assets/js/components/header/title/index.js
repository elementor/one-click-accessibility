import MainTitle from '@ea11y-apps/scanner/components/header/title/main-title';
import ManageFixesTitle from '@ea11y-apps/scanner/components/header/title/manage-fixes-title';
import ManageHeadingsTitle from '@ea11y-apps/scanner/components/header/title/manage-headings-title';
import { BLOCKS } from '@ea11y-apps/scanner/constants';
import { useScannerWizardContext } from '@ea11y-apps/scanner/context/scanner-wizard-context';

const HeaderTitle = () => {
	const { openedBlock, isManage } = useScannerWizardContext();

	if (!isManage) {
		return <MainTitle />;
	}

	if (BLOCKS.headingStructure === openedBlock) {
		return <ManageHeadingsTitle />;
	}

	return <ManageFixesTitle />;
};

export default HeaderTitle;
