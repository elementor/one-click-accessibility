import CircleCheckFilledIcon from '@elementor/icons/CircleCheckFilledIcon';
import Box from '@elementor/ui/Box';
import Radio from '@elementor/ui/Radio';
import Typography from '@elementor/ui/Typography';
import { RemediationForm } from '@ea11y-apps/scanner/components/remediation-form';
import { BLOCKS } from '@ea11y-apps/scanner/constants';
import { uxMessaging } from '@ea11y-apps/scanner/constants/ux-messaging';
import { useScannerWizardContext } from '@ea11y-apps/scanner/context/scanner-wizard-context';
import {
	StyledAccordion,
	StyledAccordionSummary,
} from '@ea11y-apps/scanner/styles/manual-fixes.styles';
import { useEffect } from '@wordpress/element';

export const RemediationLayout = () => {
	const {
		openIndex,
		handleOpen,
		openedBlock,
		sortedRemediation,
		setOpenedBlock,
	} = useScannerWizardContext();

	useEffect(() => {
		if (sortedRemediation[openedBlock]?.length === 0) {
			setOpenedBlock(BLOCKS.management);
		}
	}, [sortedRemediation[openedBlock]?.length]);

	return (
		<Box sx={{ pb: 8 }}>
			{sortedRemediation[openedBlock].map((item, index) => (
				<StyledAccordion
					key={`${item.rule}-${index}`}
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
							checked={Number(item.active)}
							role="presentation"
						/>
						<Typography variant="body2" sx={{ mr: 0.5 }} noWrap>
							{uxMessaging[item.rule]?.violationName ?? item.rule}
						</Typography>
					</StyledAccordionSummary>
					<RemediationForm item={item} />
				</StyledAccordion>
			))}
		</Box>
	);
};
