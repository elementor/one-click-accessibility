import CircleCheckFilledIcon from '@elementor/icons/CircleCheckFilledIcon';
import WorldIcon from '@elementor/icons/WorldIcon';
import Box from '@elementor/ui/Box';
import Radio from '@elementor/ui/Radio';
import Tooltip from '@elementor/ui/Tooltip';
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
import { __ } from '@wordpress/i18n';

export const ManageManualLayout = () => {
	const {
		openIndex,
		handleOpen,
		openedBlock,
		sortedRemediation,
		sortedGlobalRemediation,
		isManageGlobal,
		setOpenedBlock,
	} = useScannerWizardContext();

	const remediations = isManageGlobal
		? sortedGlobalRemediation
		: sortedRemediation;

	useEffect(() => {
		if (remediations[openedBlock]?.length === 0) {
			setOpenedBlock(BLOCKS.management);
		}
	}, [remediations[openedBlock]?.length]);

	return (
		<Box sx={{ pb: 8 }}>
			{remediations[openedBlock].map((item, index) => (
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
						<Box display="flex" gap={0.5} alignItems="center">
							<Typography variant="body2" noWrap>
								{uxMessaging[item.rule]?.violationName ?? item.rule}
							</Typography>
							{item.global === '1' && (
								<Tooltip
									arrow
									placement="top"
									title={__('Cross-scan issue', 'pojo-accessibility')}
									PopperProps={{
										disablePortal: true,
									}}
								>
									<WorldIcon color="action" fontSize="tiny" />
								</Tooltip>
							)}
						</Box>
					</StyledAccordionSummary>
					<RemediationForm item={item} />
				</StyledAccordion>
			))}
		</Box>
	);
};
