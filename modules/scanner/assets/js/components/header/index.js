import XIcon from '@elementor/icons/XIcon';
import { Chip } from '@elementor/ui';
import Box from '@elementor/ui/Box';
import Card from '@elementor/ui/Card';
import CardContent from '@elementor/ui/CardContent';
import Divider from '@elementor/ui/Divider';
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
		violation;
	const showDivider =
		!loading &&
		(!PAGE_QUOTA_LIMIT ||
			isError ||
			openedBlock === BLOCKS.main ||
			openedBlock === BLOCKS.altText);

	const showMainBlock = !isError && PAGE_QUOTA_LIMIT;

	return (
		<StyledCard square={true} variant="elevation" elevation={0}>
			<Paper color="secondary" elevation={0} square>
				<StyledContent>
					<Box
						display="flex"
						justifyContent="space-between"
						alignItems="center"
					>
						<Box display="flex" alignItems="center" gap={1}>
							<Logo />
							<Typography variant="subtitle1">
								{__('Accessibility Scanner', 'pojo-accessibility')}
							</Typography>
						</Box>

						<IconButton
							onClick={onClose}
							aria-label={__('Close', 'pojo-accessibility')}
						>
							<XIcon />
						</IconButton>
					</Box>
				</StyledContent>
			</Paper>
			<StyledContent>
				<Box display="flex" alignItems="center" gap={1}>
					<Typography variant="body1">
						{window?.ea11yScannerData?.pageData?.title}
					</Typography>
					{showChip && (
						<Chip
							size="tiny"
							color="error"
							variant="standard"
							label={`${results ? violation : ''} ${__('Issues found', 'pojo-accessibility')}`}
						/>
					)}
				</Box>
				{showMainBlock && (
					<>{openedBlock === BLOCKS.main ? <ScanStats /> : <Breadcrumbs />}</>
				)}
				{showDivider && <Divider />}
			</StyledContent>
		</StyledCard>
	);
};

const StyledCard = styled(Card)`
	position: sticky;
	top: 0;
	z-index: 2;
`;

const StyledContent = styled(CardContent)`
	display: flex;
	flex-direction: column;
	gap: ${({ theme }) => theme.spacing(1.5)};
	padding: ${({ theme }) => theme.spacing(2)}
		${({ theme }) => theme.spacing(1.5)};
	&:last-child {
		padding-bottom: ${({ theme }) => theme.spacing(1.5)};
	}
`;
