import { AltTextForm } from '@ea11y-apps/scanner/components/alt-text-form';
import { AltTextNavigation } from '@ea11y-apps/scanner/components/alt-text-navigation';
import { useScannerWizardContext } from '@ea11y-apps/scanner/context/scanner-wizard-context';
import { StyledContent } from '@ea11y-apps/scanner/styles/app.styles';
import { focusOnElement } from '@ea11y-apps/scanner/utils/focus-on-element';
import { useEffect, useState } from '@wordpress/element';

export const AltTextLayout = () => {
	const { sortedViolations } = useScannerWizardContext();
	const [current, setCurrent] = useState(0);

	useEffect(() => {
		focusOnElement(sortedViolations.altText[current].node);
	}, [current]);

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
