import Alert from '@elementor/ui/Alert';
import Button from '@elementor/ui/Button';
import CardContent from '@elementor/ui/CardContent';
import Typography from '@elementor/ui/Typography';
import { styled } from '@elementor/ui/styles';
import CrownFilled from '@ea11y-apps/global/icons/crown-filled';
import { MainList } from '@ea11y-apps/scanner/components/main-list';
import {
	HIDE_UPGRADE_KEY,
	IS_PRO_PLAN,
	ONE_WEEK_IN_MS,
	UPGRADE_URL,
} from '@ea11y-apps/scanner/constants';
import { useState } from '@wordpress/element';
import { __ } from '@wordpress/i18n';

export const MainLayout = () => {
	const [showUpgradeAlert, setShowUpgradeAlert] = useState(true);

	const hideUpgradeAlert = () => {
		window.localStorage.setItem(HIDE_UPGRADE_KEY, Date.now().toString());
		setShowUpgradeAlert(false);
	};

	const isShowUpgradeAlert = () => {
		const time = window.localStorage.getItem(HIDE_UPGRADE_KEY);
		if (!time || showUpgradeAlert) {
			return true;
		}
		const diff = Date.now() - time;
		return diff > ONE_WEEK_IN_MS;
	};

	return (
		<StyledContent>
			<Typography variant="body1" as="h3" sx={{ color: 'text.secondary' }}>
				{__('All issues', 'pojo-accessibility')}
			</Typography>

			<MainList />
			{IS_PRO_PLAN && isShowUpgradeAlert() && (
				<Alert
					icon={<CrownFilled color="promotion" />}
					color="error"
					onClose={hideUpgradeAlert}
				>
					<Typography variant="body2" sx={{ mb: 1.5, color: 'text.secondary' }}>
						{__(
							'Resolve these issues on all of your scanned pages with a click.',
							'pojo-accessibility',
						)}
					</Typography>
					<Button
						size="small"
						color="promotion"
						variant="contained"
						href={UPGRADE_URL}
						target="_blank"
						rel="noreferrer"
					>
						{__('Upgrade now', 'pojo-accessibility')}
					</Button>
				</Alert>
			)}
		</StyledContent>
	);
};

const StyledContent = styled(CardContent)`
	display: flex;
	flex-direction: column;
	gap: ${({ theme }) => theme.spacing(2)};
	padding: 0 ${({ theme }) => theme.spacing(2)};
`;
