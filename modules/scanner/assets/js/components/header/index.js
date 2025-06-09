import XIcon from '@elementor/icons/XIcon';
import Box from '@elementor/ui/Box';
import Card from '@elementor/ui/Card';
import Chip from '@elementor/ui/Chip';
import IconButton from '@elementor/ui/IconButton';
import Paper from '@elementor/ui/Paper';
import Typography from '@elementor/ui/Typography';
import { styled } from '@elementor/ui/styles';
import { Breadcrumbs } from '@ea11y-apps/scanner/components/header/breadcrumbs';
import { ScanStats } from '@ea11y-apps/scanner/components/header/scan-stats';
import {
	BLOCKS,
	PAGE_QUOTA_LIMIT,
	ROOT_ID,
} from '@ea11y-apps/scanner/constants';
import { useScannerWizardContext } from '@ea11y-apps/scanner/context/scanner-wizard-context';
import { Logo } from '@ea11y-apps/scanner/images';
import {
	HeaderCard,
	HeaderContent,
	TitleBox,
} from '@ea11y-apps/scanner/styles/app.styles';
import { closeWidget } from '@ea11y-apps/scanner/utils/close-widget';
import { __ } from '@wordpress/i18n';

export const Header = () => {
	const { openedBlock, results, loading, isError } = useScannerWizardContext();
	const violation = results?.summary?.counts?.violation;
	const onClose = () => {
		const widget = document.getElementById(ROOT_ID);
		closeWidget(widget);
	};

	const showChip =
		PAGE_QUOTA_LIMIT &&
		!isError &&
		!loading &&
		openedBlock === BLOCKS.main &&
		violation > 0;

	const showMainBlock =
		(!isError && PAGE_QUOTA_LIMIT && violation > 0) || loading;

	const content = (
		<>
			{openedBlock === BLOCKS.main && (
				<TitleBox sx={{ mb: window.ea11yScannerData?.isConnected ? 2 : 0 }}>
					<Typography variant="subtitle1" color="text.primary">
						{window?.ea11yScannerData?.pageData?.title}
					</Typography>
					{showChip && (
						<Chip
							size="tiny"
							color="error"
							variant="outlined"
							label={`${results ? violation : ''} ${__('Issues found', 'pojo-accessibility')}`}
						/>
					)}
				</TitleBox>
			)}
			{showMainBlock && (
				<>{openedBlock === BLOCKS.main ? <ScanStats /> : <Breadcrumbs />}</>
			)}
		</>
	);

	return (
		<StyledCard square={true} variant="elevation" elevation={0}>
			<Paper color="secondary" elevation={0} square>
				<HeaderContent>
					<Box
						display="flex"
						justifyContent="space-between"
						alignItems="center"
					>
						<Box display="flex" alignItems="center" gap={1}>
							<Logo />
							<Typography variant="subtitle1">
								{__('Accessibility Assistant', 'pojo-accessibility')}
							</Typography>
						</Box>

						<IconButton
							onClick={onClose}
							aria-label={__('Close', 'pojo-accessibility')}
						>
							<XIcon />
						</IconButton>
					</Box>
				</HeaderContent>
			</Paper>
			<HeaderContent>
				{openedBlock === BLOCKS.main ? (
					<HeaderCard>
						<HeaderContent>{content}</HeaderContent>
					</HeaderCard>
				) : (
					content
				)}
			</HeaderContent>
		</StyledCard>
	);
};

const StyledCard = styled(Card)`
	position: sticky;
	top: 0;
	z-index: 2;
`;
