import ArrowLeftIcon from '@elementor/icons/ArrowLeftIcon';
import InfoCircleIcon from '@elementor/icons/InfoCircleIcon';
import Box from '@elementor/ui/Box';
import IconButton from '@elementor/ui/IconButton';
import Infotip from '@elementor/ui/Infotip';
import Typography from '@elementor/ui/Typography';
import { styled } from '@elementor/ui/styles';
import {
	BLOCK_INFO,
	BLOCK_TITLES,
	BLOCKS,
} from '@ea11y-apps/scanner/constants';
import { useHeadingStructureContext } from '@ea11y-apps/scanner/context/heading-structure-context';
import { useScannerWizardContext } from '@ea11y-apps/scanner/context/scanner-wizard-context';
import { removeExistingFocus } from '@ea11y-apps/scanner/utils/focus-on-element';
import { areNoHeadingsDefined } from '@ea11y-apps/scanner/utils/page-headings';
import { __ } from '@wordpress/i18n';
import HeadingStructureTitleRow from './title-row';

const HeadingStructureSubheader = () => {
	const { validationStats } = useHeadingStructureContext();
	const { openedBlock, setOpenedBlock, isManage } = useScannerWizardContext();

	const handleClick = () => {
		removeExistingFocus();
		setOpenedBlock(isManage ? BLOCKS.management : BLOCKS.main);
	};

	return (
		<>
			<Box>
				<StyledBreadcrumbsBox>
					<IconButton
						color="secondary"
						onClick={handleClick}
						sx={{ whiteSpace: 'nowrap' }}
						aria-label={__('Return to all issues', 'pojo-accessibility')}
						size="small"
					>
						<ArrowLeftIcon />
					</IconButton>

					<Box display="flex" alignItems="center" gap={1}>
						<Typography variant="subtitle2" as="h3">
							{validationStats.total
								? `${BLOCK_TITLES[openedBlock]} (${validationStats.total})`
								: BLOCK_TITLES[openedBlock]}
						</Typography>

						{BLOCK_INFO[openedBlock] && (
							<Infotip
								tabIndex="0"
								PopperProps={{
									disablePortal: true,
								}}
								content={
									<Typography variant="body2" sx={{ p: 2, maxWidth: '300px' }}>
										{BLOCK_INFO[openedBlock]}
									</Typography>
								}
							>
								<InfoCircleIcon fontSize="small" color="action" />
							</Infotip>
						)}
					</Box>
				</StyledBreadcrumbsBox>
			</Box>

			{!areNoHeadingsDefined() && (
				<HeadingStructureTitleRow
					success={validationStats.success}
					error={validationStats.error}
					warning={validationStats.warning}
				/>
			)}
		</>
	);
};

const StyledBreadcrumbsBox = styled(Box)`
	display: flex;
	align-items: center;

	padding: ${({ theme }) => theme.spacing(1.5)};
	gap: ${({ theme }) => theme.spacing(1)};

	background-color: ${({ theme }) => theme.palette.background.default};
`;

export default HeadingStructureSubheader;
