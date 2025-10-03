import { BLOCKS } from '@ea11y-apps/scanner/constants';
import { useScannerWizardContext } from '@ea11y-apps/scanner/context/scanner-wizard-context';
import Breadcrumbs from './breadcrumbs';
import HeadingStructureSubheader from './heading-structure';

const Subheader = () => {
	const { openedBlock } = useScannerWizardContext();

	return openedBlock === BLOCKS.headingStructure ? (
		<HeadingStructureSubheader />
	) : (
		<Breadcrumbs />
	);
};

export default Subheader;
