import Chip from '@elementor/ui/Chip';
import Typography from '@elementor/ui/Typography';
import { ManagementStats } from '@ea11y-apps/scanner/components/header/stats/management-stats';
import { ScanStats } from '@ea11y-apps/scanner/components/header/stats/scan-stats';
import Subheader from '@ea11y-apps/scanner/components/header/subheader';
import { BLOCKS, PAGE_QUOTA_LIMIT } from '@ea11y-apps/scanner/constants';
import { useScannerWizardContext } from '@ea11y-apps/scanner/context/scanner-wizard-context';
import useScannerSettings from '@ea11y-apps/scanner/hooks/use-scanner-settings';
import {
	StyledStatsBlock,
	TitleBox,
} from '@ea11y-apps/scanner/styles/app.styles';
import { __ } from '@wordpress/i18n';

const Header = () => {
	const {
		openedBlock,
		results,
		loading,
		isError,
		isManage,
		violation: violationsCount,
	} = useScannerWizardContext();
	const { pageData, isConnected } = useScannerSettings();

	const showViolationsChip =
		PAGE_QUOTA_LIMIT &&
		!isError &&
		!loading &&
		openedBlock === BLOCKS.main &&
		violationsCount > 0;

	const hideHeader =
		!isManage &&
		(!isConnected ||
			isError ||
			!PAGE_QUOTA_LIMIT ||
			(!violationsCount && !loading));

	const showStatsBlock =
		openedBlock === BLOCKS.main || openedBlock === BLOCKS.management;

	if (hideHeader) {
		return null;
	}

	if (showStatsBlock) {
		return (
			<StyledStatsBlock>
				<TitleBox
					sx={{
						mb: isConnected && !isError ? 2 : 0,
					}}
				>
					<Typography variant="subtitle1" as="h3" color="text.primary">
						{pageData.title}
					</Typography>

					{showViolationsChip && (
						<Chip
							size="small"
							color="error"
							variant="outlined"
							label={`${results ? violationsCount : ''} ${__('Issues found', 'pojo-accessibility')}`}
						/>
					)}
				</TitleBox>

				{isManage ? <ManagementStats /> : <ScanStats />}
			</StyledStatsBlock>
		);
	}

	return <Subheader />;
};

export default Header;
