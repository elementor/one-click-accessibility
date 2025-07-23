import { mixpanelEvents, mixpanelService } from '@ea11y-apps/global/services';
import { ColorContrastForm } from '@ea11y-apps/scanner/components/color-contrast-form';
import { FormNavigation } from '@ea11y-apps/scanner/components/form-navigation';
import { BLOCKS } from '@ea11y-apps/scanner/constants';
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
                        focusOnElement(item?.node);
                } else {
                        removeExistingFocus();
                }

                if (item) {
                        mixpanelService.sendEvent(mixpanelEvents.issueSelected, {
                                issue_type: item.message,
                                rule_id: item.ruleId,
                                wcag_level: item.reasonCategory.match(/\((AAA?|AA?|A)\)/)?.[1] || '',
                                category_name: BLOCKS.colorContrast,
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
				items={sortedViolations.colorContrast}
				current={current}
				setCurrent={changeNavigation}
			/>
			<FormNavigation
				total={sortedViolations.colorContrast.length}
				current={current}
				setCurrent={changeNavigation}
			/>
		</StyledContent>
	);
};
