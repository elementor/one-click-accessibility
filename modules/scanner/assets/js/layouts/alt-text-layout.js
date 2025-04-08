import { AltTextForm } from '@ea11y-apps/scanner/components/alt-text-form';
import { AltTextNavigation } from '@ea11y-apps/scanner/components/alt-text-navigation';
import { useScannerWizardContext } from '@ea11y-apps/scanner/context/scanner-wizard-context';
import { StyledContent } from '@ea11y-apps/scanner/styles/app.styles';
import { useState } from '@wordpress/element';

export const AltTextLayout = () => {
	const { sortedViolations } = useScannerWizardContext();
	const [current, setCurrent] = useState(0);

	return (
		<StyledContent>
			<AltTextForm items={sortedViolations.altText} current={current} />
			<AltTextNavigation
				total={sortedViolations.altText.length}
				current={current}
				setCurrent={setCurrent}
			/>
		</StyledContent>
	);
};
