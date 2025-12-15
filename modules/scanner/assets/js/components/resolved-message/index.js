import Button from '@elementor/ui/Button';
import Typography from '@elementor/ui/Typography';
import { BLOCKS, ROOT_ID } from '@ea11y-apps/scanner/constants';
import { useScannerWizardContext } from '@ea11y-apps/scanner/context/scanner-wizard-context';
import { useTabsContext } from '@ea11y-apps/scanner/context/tabs-context';
import { ResolvedImage } from '@ea11y-apps/scanner/images';
import {
	ResolvedButtonsBox,
	StateContainer,
} from '@ea11y-apps/scanner/styles/app.styles';
import { closeWidget } from '@ea11y-apps/scanner/utils/close-widget';
import { __ } from '@wordpress/i18n';

export const ResolvedMessage = () => {
	const { remediations } = useScannerWizardContext();
	const { tabsProps } = useTabsContext();

	const handleChangeTab = (event) => {
		tabsProps.onChange(event, BLOCKS.management);
	};

	const onClose = () => {
		const widget = document.getElementById(ROOT_ID);
		closeWidget(widget);
	};

	return (
		<StateContainer sx={{ px: 4 }}>
			<ResolvedImage />

			<Typography variant="subtitle1" as="h3" align="center">
				{__('You’re all set!', 'pojo-accessibility')}
			</Typography>

			<Typography variant="body2" align="center" color="text.secondary">
				{__(
					'This page is now issue‑free. View all scans to track your progress, or review the fixes you just made.',
					'pojo-accessibility',
				)}
			</Typography>

			<ResolvedButtonsBox>
				{remediations?.length > 0 && (
					<Button
						size="small"
						variant="outlined"
						color="secondary"
						onClick={handleChangeTab}
					>
						{__('Review fixes', 'pojo-accessibility')}
					</Button>
				)}

				<Button
					href={window?.ea11yScannerData?.dashboardUrl}
					size="small"
					variant="contained"
					color="info"
					onClick={onClose}
				>
					{__('View all scans', 'pojo-accessibility')}
				</Button>
			</ResolvedButtonsBox>
		</StateContainer>
	);
};
