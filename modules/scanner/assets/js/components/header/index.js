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
import { HeadingStructureHeader } from '@ea11y-apps/scanner/components/header/heading-structure';
import MainTitle from '@ea11y-apps/scanner/components/header/main-title';
import ManageFixesTitle from '@ea11y-apps/scanner/components/header/manage-fixes-title';
import ManageHeadingsTitle from '@ea11y-apps/scanner/components/header/manage-headings-title';
import { ManagementStats } from '@ea11y-apps/scanner/components/header/management-stats';
import { ScanStats } from '@ea11y-apps/scanner/components/header/scan-stats';
import {
	BLOCKS,
	PAGE_QUOTA_LIMIT,
	ROOT_ID,
} from '@ea11y-apps/scanner/constants';
import { useScannerWizardContext } from '@ea11y-apps/scanner/context/scanner-wizard-context';
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

	const headerTitle = () => {
		if (!isManage) {
			return <MainTitle />;
		}

		if (BLOCKS.headingStructure) {
			return <ManageHeadingsTitle />;
		}

		return <ManageFixesTitle />;
	};

	const headerData = () => {
		switch (openedBlock) {
			case BLOCKS.main:
				return <ScanStats />;
			case BLOCKS.management:
				return <ManagementStats />;
			case BLOCKS.headingStructure:
				return <HeadingStructureHeader />;
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
							{headerTitle()}
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
				<HeaderContent block={openedBlock}>
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
