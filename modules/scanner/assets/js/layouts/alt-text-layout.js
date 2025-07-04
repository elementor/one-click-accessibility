import { mixpanelEvents, mixpanelService } from '@ea11y-apps/global/services';
import { AltTextForm } from '@ea11y-apps/scanner/components/alt-text-form';
import { AltTextNavigation } from '@ea11y-apps/scanner/components/alt-text-navigation';
import { BLOCK_TITLES, BLOCKS } from '@ea11y-apps/scanner/constants';
import { useScannerWizardContext } from '@ea11y-apps/scanner/context/scanner-wizard-context';
import { StyledContent } from '@ea11y-apps/scanner/styles/app.styles';
import {
	focusOnElement,
	removeExistingFocus,
} from '@ea11y-apps/scanner/utils/focus-on-element';
import { useEffect, useState } from '@wordpress/element';

export const AltTextLayout = () => {
	const { sortedViolations, isResolved } = useScannerWizardContext();
	const [current, setCurrent] = useState(0);

	const resolved = isResolved(BLOCKS.altText);

	useEffect(() => {
		const item = sortedViolations.altText[current];
		if (!resolved && sortedViolations.altText.length) {
			focusOnElement(item.node);
		} else {
			removeExistingFocus();
		}

		mixpanelService.sendEvent(mixpanelEvents.issueSelected, {
			issue_type: item.message,
			rule_id: item.ruleId,
			wcag_level: item.reasonCategory.match(/\((AAA?|AA?|A)\)/)?.[1] || '',
			category_name: BLOCK_TITLES[BLOCKS.altText],
		});
	}, [current]);

	const changeNavigation = (index) => {
		if (index > sortedViolations.altText.length - 1) {
			setCurrent(0);
		} else {
			setCurrent(index);
		}
	};

	return (
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
