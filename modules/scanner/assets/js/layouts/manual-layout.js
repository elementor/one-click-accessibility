import AccordionDetails from '@elementor/ui/AccordionDetails';
import AccordionSummary from '@elementor/ui/AccordionSummary';
import Typography from '@elementor/ui/Typography';
import { useScannerWizardContext } from '@ea11y-apps/scanner/context/scanner-wizard-context';
import { StyledAccordion } from '@ea11y-apps/scanner/styles/manual-fixes.style';

export const ManualLayout = () => {
	const { openedBlock, sortedViolations } = useScannerWizardContext();
	console.log(sortedViolations[openedBlock]);
	return (
		<>
			{sortedViolations[openedBlock].map((item, index) => (
				<StyledAccordion
					key={`${item.ruleId}-${index}`}
					elevation={0}
					square
					disableGutters
				>
					<AccordionSummary
						aria-controls={`manual-panel-${index}`}
						id={`manual-panel-${index}`}
						sx={{ minHeight: '44px' }}
					>
						<Typography>{item.ruleId}</Typography>
					</AccordionSummary>
					<AccordionDetails>
						<Typography variant="subtitle1">{item.category}</Typography>
						<Typography variant="body1">{item.message}</Typography>
					</AccordionDetails>
				</StyledAccordion>
			))}
		</>
	);
};
