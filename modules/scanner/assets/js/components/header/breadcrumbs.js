import ArrowLeftIcon from '@elementor/icons/ArrowLeftIcon';
import InfoCircleIcon from '@elementor/icons/InfoCircleIcon';
import Box from '@elementor/ui/Box';
import Chip from '@elementor/ui/Chip';
import IconButton from '@elementor/ui/IconButton';
import Infotip from '@elementor/ui/Infotip';
import Typography from '@elementor/ui/Typography';
import { styled } from '@elementor/ui/styles';
import {
	BLOCK_INFO,
	BLOCK_TITLES,
	BLOCKS,
} from '@ea11y-apps/scanner/constants';
import { useScannerWizardContext } from '@ea11y-apps/scanner/context/scanner-wizard-context';
import { removeExistingFocus } from '@ea11y-apps/scanner/utils/focus-on-element';

export const Breadcrumbs = () => {
	const {
		openedBlock,
		sortedViolations,
		setOpenedBlock,
		altTextData,
		manualData,
	} = useScannerWizardContext();

	const handleClick = () => {
		removeExistingFocus();
		setOpenedBlock(BLOCKS.main);
	};

	const itemsData =
		openedBlock === BLOCKS.altText ? altTextData : manualData[openedBlock];

	const resolved =
		itemsData.filter((item) => item.resolved === true).length || 0;

	return (
		<Box>
			<BreadcrumbsBox>
				<IconButton
					color="secondary"
					onClick={handleClick}
					sx={{ whiteSpace: 'nowrap' }}
					size="small"
				>
					<ArrowLeftIcon />
				</IconButton>
				<Box display="flex" alignItems="center" gap={1}>
					<Typography variant="subtitle2" sx={{ maxWidth: '180px' }}>
						{BLOCK_TITLES[openedBlock]}
					</Typography>
					{BLOCK_INFO[openedBlock] && (
						<Infotip
							content={
								<Typography variant="body2" sx={{ p: 2, maxWidth: '300px' }}>
									{BLOCK_INFO[openedBlock]}
								</Typography>
							}
						>
							<InfoCircleIcon fontSize="small" />
						</Infotip>
					)}
					{sortedViolations[openedBlock].length > 0 && (
						<Chip
							label={sortedViolations[openedBlock].length - resolved}
							color="error"
							variant="standard"
							size="small"
							sx={{ fontWeight: 500 }}
						/>
					)}
				</Box>
			</BreadcrumbsBox>
		</Box>
	);
};

const BreadcrumbsBox = styled(Box)`
	display: flex;
	align-items: center;
	gap: ${({ theme }) => theme.spacing(1)};
`;
