import Box from '@elementor/ui/Box';
import CardContent from '@elementor/ui/CardContent';
import Typography from '@elementor/ui/Typography';
import { styled } from '@elementor/ui/styles';
import { EmptyManageMessage } from '@ea11y-apps/scanner/components/empty-manage-message';
import { ManageList } from '@ea11y-apps/scanner/components/manage-list';
import { ManageRemediationButtons } from '@ea11y-apps/scanner/components/manage-remediation-buttons';
import { useScannerWizardContext } from '@ea11y-apps/scanner/context/scanner-wizard-context';
import { __ } from '@wordpress/i18n';

export const ManageMainLayout = () => {
	const { remediations } = useScannerWizardContext();

	return (
		<StyledContent>
			<ManageHeader>
				<Typography variant="body2">
					{__('Fixes on this page', 'pojo-accessibility')}
				</Typography>
				<ManageRemediationButtons />
			</ManageHeader>
			{remediations.length > 0 ? <ManageList /> : <EmptyManageMessage />}
		</StyledContent>
	);
};

const ManageHeader = styled(Box)`
	display: flex;
	align-items: center;
	justify-content: space-between;
`;

const StyledContent = styled(CardContent)`
	display: flex;
	flex-direction: column;
	gap: ${({ theme }) => theme.spacing(2)};
	padding: 0 ${({ theme }) => theme.spacing(2)};
`;
