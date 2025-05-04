import CircleCheckFilledIcon from '@elementor/icons/CircleCheckFilledIcon';
import Radio from '@elementor/ui/Radio';
import Typography from '@elementor/ui/Typography';
import { ManualFixForm } from '@ea11y-apps/scanner/components/manual-fix-form';
import { uxMessaging } from '@ea11y-apps/scanner/constants/ux-messaging';
import { useScannerWizardContext } from '@ea11y-apps/scanner/context/scanner-wizard-context';
import {
	StyledAccordion,
	StyledAccordionSummary,
} from '@ea11y-apps/scanner/styles/manual-fixes.styles';
import {
	focusOnElement,
	removeExistingFocus,
} from '@ea11y-apps/scanner/utils/focus-on-element';
import { useEffect, useState } from '@wordpress/element';
import { __ } from '@wordpress/i18n';
import { ResolvedMessage } from '../components/resolved-message';

export const ManualLayout = () => {
	const { openedBlock, sortedViolations, manualData, isResolved } =
		useScannerWizardContext();

	const [openIndex, setOpenIndex] = useState(null);

	useEffect(() => {
		if (
			openIndex !== null &&
			sortedViolations[openedBlock]?.length &&
			openIndex < sortedViolations[openedBlock]?.length
		) {
			focusOnElement(sortedViolations[openedBlock][openIndex].node);
		} else {
			removeExistingFocus();
		}
	}, [openIndex]);

	const handleOpen = (index) => (event, isExpanded) => {
		setOpenIndex(isExpanded ? index : null);
	};

	return (
		<>
			{isResolved(openedBlock) ? (
				<ResolvedMessage />
			) : (
				sortedViolations[openedBlock].map((item, index) => (
					<StyledAccordion
						key={`${item.ruleId}-${index}`}
						elevation={0}
						square
						disableGutters
						expanded={openIndex === index}
						onChange={handleOpen(index)}
					>
						<StyledAccordionSummary
							aria-controls={`manual-panel-${index}`}
							id={`manual-panel-${index}`}
						>
							<Radio
								color="info"
								checkedIcon={<CircleCheckFilledIcon />}
								disabled
								checked={manualData[openedBlock][index]?.resolved || false}
								aria-label={__('Resolved', 'pojo-accessibility')}
							/>
							<Typography variant="body2" sx={{ mr: 0.5 }} noWrap>
								{uxMessaging[item.ruleId]?.violationName ?? item.category}
							</Typography>
						</StyledAccordionSummary>
						<ManualFixForm item={item} current={index} setOpen={setOpenIndex} />
					</StyledAccordion>
				))
			)}
		</>
	);
};
