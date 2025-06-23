import Box from '@elementor/ui/Box';
import CardContent from '@elementor/ui/CardContent';
import Typography from '@elementor/ui/Typography';
import { styled } from '@elementor/ui/styles';
import { ManageList } from '@ea11y-apps/scanner/components/manage-list';
import { ManageRemediationButtons } from '@ea11y-apps/scanner/components/manage-remediation-buttons';
import { BLOCKS } from '@ea11y-apps/scanner/constants';
import { useScannerWizardContext } from '@ea11y-apps/scanner/context/scanner-wizard-context';
import { useEffect } from '@wordpress/element';
import { __ } from '@wordpress/i18n';

export const ManageMainLayout = () => {
	const { remediations, setIsManage, setOpenedBlock } =
		useScannerWizardContext();

	useEffect(() => {
		if (remediations?.length === 0) {
			setIsManage(false);
			setOpenedBlock(BLOCKS.main);
		}
	}, [remediations?.length]);

	return (
		<StyledContent>
			<ManageHeader>
				<Typography variant="body2">
					{__('All issues', 'pojo-accessibility')}
				</Typography>
				<ManageRemediationButtons />
			</ManageHeader>
			<ManageList />
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
