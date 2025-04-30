import { AltTextForm } from '@ea11y-apps/scanner/components/alt-text-form';
import { AltTextNavigation } from '@ea11y-apps/scanner/components/alt-text-navigation';
import { ResolvedState } from '@ea11y-apps/scanner/components/resolved-state';
import { useScannerWizardContext } from '@ea11y-apps/scanner/context/scanner-wizard-context';
import { StyledContent } from '@ea11y-apps/scanner/styles/app.styles';
import { BLOCKS } from '@ea11y-apps/scanner/utils/constants';
import { focusOnElement } from '@ea11y-apps/scanner/utils/focus-on-element';
import { useEffect, useState } from '@wordpress/element';

export const AltTextLayout = () => {
	const { sortedViolations, isResolved } = useScannerWizardContext();
	const [current, setCurrent] = useState(0);

	useEffect(() => {
		if (sortedViolations.altText.length) {
			focusOnElement(sortedViolations.altText[current].node);
		}
	}, [current]);

	const changeNavigation = (index) => {
		if (index > sortedViolations.altText.length - 1) {
			setCurrent(0);
		} else {
			setCurrent(index);
		}
	};

	return isResolved(BLOCKS.altText) ? (
		<ResolvedState />
	) : (
		<StyledContent>
			<AltTextForm
				items={sortedViolations.altText}
				current={current}
				setCurrent={changeNavigation}
			/>
			<AltTextNavigation
				total={sortedViolations.altText.length}
				current={current}
				setCurrent={changeNavigation}
			/>
		</StyledContent>
	);
};
