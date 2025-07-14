import CircleCheckFilledIcon from '@elementor/icons/CircleCheckFilledIcon';
import Box from '@elementor/ui/Box';
import Radio from '@elementor/ui/Radio';
import Typography from '@elementor/ui/Typography';
import { ManualFixForm } from '@ea11y-apps/scanner/components/manual-fix-form';
import { uxMessaging } from '@ea11y-apps/scanner/constants/ux-messaging';
import { useScannerWizardContext } from '@ea11y-apps/scanner/context/scanner-wizard-context';
import {
	StyledAccordion,
	StyledAccordionSummary,
} from '@ea11y-apps/scanner/styles/manual-fixes.styles';
import { __ } from '@wordpress/i18n';

export const ManualLayout = () => {
	const {
		openIndex,
		setOpenIndex,
		handleOpen,
		openedBlock,
		sortedViolations,
		manualData,
	} = useScannerWizardContext();

	return (
		<Box sx={{ pb: 8 }}>
			{sortedViolations[openedBlock].map((item, index) => (
				<StyledAccordion
					key={`${item.ruleId}-${index}`}
					elevation={0}
					square
					disableGutters
					expanded={openIndex === index}
					onChange={handleOpen(index, item)}
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

						<Typography variant="body2" as="h4" sx={{ mr: 0.5 }} noWrap>
							{uxMessaging[item.ruleId]?.violationName ?? item.category}
						</Typography>
					</StyledAccordionSummary>

					<ManualFixForm item={item} current={index} setOpen={setOpenIndex} />
				</StyledAccordion>
			))}
		</Box>
	);
};
