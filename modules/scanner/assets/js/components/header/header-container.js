import ChevronLeftIcon from '@elementor/icons/ChevronLeftIcon';
import XIcon from '@elementor/icons/XIcon';
import Box from '@elementor/ui/Box';
import IconButton from '@elementor/ui/IconButton';
import Paper from '@elementor/ui/Paper';
import { styled } from '@elementor/ui/styles';
import PropTypes from 'prop-types';
import { APIScanner } from '@ea11y-apps/scanner/api/APIScanner';
import { DropdownMenu } from '@ea11y-apps/scanner/components/header/dropdown-menu';
import HeaderTitle from '@ea11y-apps/scanner/components/header/title';
import { BLOCKS, ROOT_ID } from '@ea11y-apps/scanner/constants';
import { useScannerWizardContext } from '@ea11y-apps/scanner/context/scanner-wizard-context';
import { StyledHeaderContent } from '@ea11y-apps/scanner/styles/app.styles';
import { closeWidget } from '@ea11y-apps/scanner/utils/close-widget';
import { __ } from '@wordpress/i18n';

const HeaderContainer = ({ children }) => {
	const { isChanged, setOpenedBlock, isManage, setIsManage } =
		useScannerWizardContext();

	const goBack = () => {
		setIsManage(false);
		setOpenedBlock(BLOCKS.main);
	};

	const onClose = () => {
		const widget = document.getElementById(ROOT_ID);

		closeWidget(widget);

		if (isChanged) {
			void APIScanner.triggerSave({
				object_id: window?.ea11yScannerData?.pageData?.object_id,
				object_type: window?.ea11yScannerData?.pageData?.object_type,
			});
		}
	};

	return (
		<StyledHeaderContainer>
			<Paper color="secondary" elevation={0} square>
				<StyledHeaderContent>
					<Box
						display="flex"
						justifyContent="space-between"
						alignItems="center"
					>
						<StyledTitleWrapper>
							{isManage && (
								<IconButton
									onClick={goBack}
									aria-label={__('Back', 'pojo-accessibility')}
								>
									<ChevronLeftIcon />
								</IconButton>
							)}

							<Box display="flex" alignItems="center" gap={1}>
								<HeaderTitle />
							</Box>
						</StyledTitleWrapper>

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
				</StyledHeaderContent>
			</Paper>

			{children}
		</StyledHeaderContainer>
	);
};

const StyledHeaderContainer = styled(Box)`
	position: sticky;
	top: 0;
	z-index: 2;

	overflow: visible;
`;

const StyledTitleWrapper = styled(Box)`
	display: flex;
	align-items: center;

	.MuiButtonBase-root {
		margin-inline-end: 8px;
	}
`;

HeaderContainer.propTypes = {
	children: PropTypes.node,
};

export default HeaderContainer;
