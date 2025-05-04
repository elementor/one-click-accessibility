import { AltTextForm } from '@ea11y-apps/scanner/components/alt-text-form';
import { AltTextNavigation } from '@ea11y-apps/scanner/components/alt-text-navigation';
import { BLOCKS } from '@ea11y-apps/scanner/constants';
import { useScannerWizardContext } from '@ea11y-apps/scanner/context/scanner-wizard-context';
import { StyledContent } from '@ea11y-apps/scanner/styles/app.styles';
import {
	focusOnElement,
	removeExistingFocus,
} from '@ea11y-apps/scanner/utils/focus-on-element';
import { useEffect, useState } from '@wordpress/element';
import { ResolvedMessage } from '../components/resolved-message';

export const AltTextLayout = () => {
	const { sortedViolations, isResolved } = useScannerWizardContext();
	const [current, setCurrent] = useState(0);

	const resolved = isResolved(BLOCKS.altText);

	useEffect(() => {
		if (!resolved && sortedViolations.altText.length) {
			focusOnElement(sortedViolations.altText[current].node);
		} else {
			removeExistingFocus();
		}
	}, [current]);

	const changeNavigation = (index) => {
		if (index > sortedViolations.altText.length - 1) {
			setCurrent(0);
		} else {
			setCurrent(index);
		}
	};

	return resolved ? (
		<ResolvedMessage />
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
