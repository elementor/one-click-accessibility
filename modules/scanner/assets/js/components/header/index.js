import SettingsIcon from '@elementor/icons/SettingsIcon';
import XIcon from '@elementor/icons/XIcon';
import Box from '@elementor/ui/Box';
import Card from '@elementor/ui/Card';
import Chip from '@elementor/ui/Chip';
import IconButton from '@elementor/ui/IconButton';
import Paper from '@elementor/ui/Paper';
import Typography from '@elementor/ui/Typography';
import { styled } from '@elementor/ui/styles';
import { APIScanner } from '@ea11y-apps/scanner/api/APIScanner';
import { Breadcrumbs } from '@ea11y-apps/scanner/components/header/breadcrumbs';
import { DropdownMenu } from '@ea11y-apps/scanner/components/header/dropdown-menu';
import { ManagementStats } from '@ea11y-apps/scanner/components/header/management-stats';
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
	const {
		openedBlock,
		results,
		loading,
		isError,
		isManage,
		isChanged,
		setOpenedBlock,
		setIsManage,
	} = useScannerWizardContext();
	const violation = results?.summary?.counts?.violation;
	const onClose = () => {
		if (isManage) {
			setIsManage(false);
			setOpenedBlock(BLOCKS.main);
		} else {
			const widget = document.getElementById(ROOT_ID);
			closeWidget(widget);
			if (isChanged) {
				void APIScanner.triggerSave({
					object_id: window?.ea11yScannerData?.pageData?.object_id,
					object_type: window?.ea11yScannerData?.pageData?.object_type,
				});
			}
		}
	};

	const showChip =
		PAGE_QUOTA_LIMIT &&
		!isError &&
		!loading &&
		openedBlock === BLOCKS.main &&
		violation > 0;

	const showMainBlock =
		window.ea11yScannerData?.isConnected &&
		!isError &&
		PAGE_QUOTA_LIMIT &&
		(violation > 0 || loading);

	const isMainHeader =
		openedBlock === BLOCKS.main || openedBlock === BLOCKS.management;

	const headerData = () => {
		switch (openedBlock) {
			case BLOCKS.main:
				return <ScanStats />;
			case BLOCKS.management:
				return <ManagementStats />;
			default:
				return <Breadcrumbs />;
		}
	};

	const content = (
		<>
			{isMainHeader && (
				<TitleBox
					sx={{ mb: window.ea11yScannerData?.isConnected && !isError ? 2 : 0 }}
				>
					<Typography variant="subtitle1" as="h3" color="text.primary">
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

			{headerData()}
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
							{isManage ? (
								<>
									<SettingsIcon size="small" color="action" />

									<StyledTitle variant="subtitle1" as="h2">
										{__('Manage fixes', 'pojo-accessibility')}
									</StyledTitle>
								</>
							) : (
								<>
									<Logo />

									<StyledTitle variant="subtitle1" as="h2">
										{__('Accessibility Assistant', 'pojo-accessibility')}

										<Chip
											size="small"
											variant="filled"
											color="default"
											label={__('Beta', 'pojo-accessibility')}
										/>
									</StyledTitle>
								</>
							)}
						</Box>

						<Box display="flex" gap={1}>
							<DropdownMenu />
							<IconButton
								onClick={onClose}
								aria-label={__('Close', 'pojo-accessibility')}
							>
								<XIcon />
							</IconButton>
						</Box>
					</Box>
				</HeaderContent>
			</Paper>

			{showMainBlock && (
				<HeaderContent>
					{isMainHeader ? (
						<HeaderCard>
							<HeaderContent>{content}</HeaderContent>
						</HeaderCard>
					) : (
						content
					)}
				</HeaderContent>
			)}
		</StyledCard>
	);
};

const StyledCard = styled(Card)`
	position: sticky;
	top: 0;
	z-index: 2;
	overflow: visible;
`;

const StyledTitle = styled(Typography)`
	font-size: 16px;
	font-weight: 500;
	line-height: 130%;
	letter-spacing: 0.15px;
	margin: 0;

	.MuiChip-root {
		margin-inline-start: ${({ theme }) => theme.spacing(1)};

		font-weight: 400;
	}
`;
