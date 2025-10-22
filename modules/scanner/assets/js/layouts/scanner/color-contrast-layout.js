import { mixpanelEvents, mixpanelService } from '@ea11y-apps/global/services';
import { ColorContrastForm } from '@ea11y-apps/scanner/components/color-contrast-form';
import { FormNavigation } from '@ea11y-apps/scanner/components/form-navigation';
import { BLOCKS, COLOR_ELEMENT_CLASS } from '@ea11y-apps/scanner/constants';
import { useScannerWizardContext } from '@ea11y-apps/scanner/context/scanner-wizard-context';
import { StyledContent } from '@ea11y-apps/scanner/styles/app.styles';
import {
	focusOnElement,
	removeExistingFocus,
} from '@ea11y-apps/scanner/utils/focus-on-element';
import { useEffect, useState } from '@wordpress/element';

export const ColorContrastLayout = () => {
	const { sortedViolations, isResolved } = useScannerWizardContext();
	const [current, setCurrent] = useState(0);

	const resolved = isResolved(BLOCKS.colorContrast);

	useEffect(() => {
		const item = sortedViolations.colorContrast?.[current];
		if (!resolved && sortedViolations.colorContrast?.length) {
			focusOnElement(item?.node, COLOR_ELEMENT_CLASS);
		} else {
			removeExistingFocus();
		}

		if (item) {
			mixpanelService.sendEvent(mixpanelEvents.issueSelected, {
				issue_type: item.message,
				rule_id: item.ruleId,
				wcag_level: item.reasonCategory.match(/\((AAA?|AA?|A)\)/)?.[1] || '',
				category_name: BLOCKS.colorContrast,
				current_contrast_ratio: item.messageArgs[0],
				scenario:
					item.messageArgs[3] && item.messageArgs[4]
						? 'regular_flow'
						: 'gradient',
			});
		}
	}, [current]);

	const changeNavigation = (index) => {
		if (index > (sortedViolations.colorContrast?.length || 0) - 1) {
			setCurrent(0);
		} else {
			setCurrent(index);
		}
	};

	return (
		<StyledContent>
			<ColorContrastForm
				item={sortedViolations.colorContrast[current]}
				current={current}
				setCurrent={changeNavigation}
			/>
			<FormNavigation
				total={sortedViolations.colorContrast?.length || 0}
				current={current}
				setCurrent={changeNavigation}
			/>
		</StyledContent>
	);
};
