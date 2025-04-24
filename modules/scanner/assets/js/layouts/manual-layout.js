import CircleCheckFilledIcon from '@elementor/icons/CircleCheckFilledIcon';
import Radio from '@elementor/ui/Radio';
import Typography from '@elementor/ui/Typography';
import { ManualFixForm } from '@ea11y-apps/scanner/components/manual-fix-form';
import { useScannerWizardContext } from '@ea11y-apps/scanner/context/scanner-wizard-context';
import {
	StyledAccordion,
	StyledAccordionSummary,
} from '@ea11y-apps/scanner/styles/manual-fixes.styles';
import { useState } from '@wordpress/element';
import { __ } from '@wordpress/i18n';

export const ManualLayout = () => {
	const { openedBlock, sortedViolations, manualData } =
		useScannerWizardContext();
	const [open, setOpen] = useState();

	const handleOpen = (index) => (event, isExpanded) => {
		setOpen(isExpanded ? index : false);
	};

	return (
		<>
			{sortedViolations[openedBlock].map((item, index) => (
				<StyledAccordion
					key={`${item.ruleId}-${index}`}
					elevation={0}
					square
					disableGutters
					expanded={open === index}
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
							{item.message}
						</Typography>
					</StyledAccordionSummary>
					<ManualFixForm item={item} current={index} setOpen={setOpen} />
				</StyledAccordion>
			))}
		</>
	);
};
