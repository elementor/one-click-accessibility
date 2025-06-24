import Button from '@elementor/ui/Button';
import Typography from '@elementor/ui/Typography';
import { BLOCKS, ROOT_ID } from '@ea11y-apps/scanner/constants';
import { useScannerWizardContext } from '@ea11y-apps/scanner/context/scanner-wizard-context';
import { ResolvedImage } from '@ea11y-apps/scanner/images';
import {
	ResolvedButtonsBox,
	StateContainer,
} from '@ea11y-apps/scanner/styles/app.styles';
import { closeWidget } from '@ea11y-apps/scanner/utils/close-widget';
import { __ } from '@wordpress/i18n';

export const ResolvedMessage = () => {
	const { remediations, setOpenedBlock, setIsManage } =
		useScannerWizardContext();
	const onClose = () => {
		const widget = document.getElementById(ROOT_ID);
		closeWidget(widget);
	};

	const showIssues = () => {
		setIsManage(true);
		setOpenedBlock(BLOCKS.management);
	};

	return (
		<StateContainer>
			<ResolvedImage />

			<Typography variant="subtitle1" align="center">
				{__('Great job!', 'pojo-accessibility')}
			</Typography>
			<Typography variant="body2" align="center" color="text.secondary">
				{__(
					"You've resolved all accessibility issues on this page.",
					'pojo-accessibility',
				)}
			</Typography>

			<ResolvedButtonsBox>
				<Button
					size="small"
					variant="outlined"
					color="secondary"
					onClick={showIssues}
					disabled={!remediations?.length}
				>
					{__('Review fixes', 'pojo-accessibility')}
				</Button>
				<Button size="small" variant="contained" color="info" onClick={onClose}>
					{__('Finish', 'pojo-accessibility')}
				</Button>
			</ResolvedButtonsBox>
		</StateContainer>
	);
};
