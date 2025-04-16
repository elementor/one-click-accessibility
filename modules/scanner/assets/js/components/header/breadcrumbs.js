import InfoCircleIcon from '@elementor/icons/InfoCircleIcon';
import { Chip } from '@elementor/ui';
import Box from '@elementor/ui/Box';
import Infotip from '@elementor/ui/Infotip';
import Link from '@elementor/ui/Link';
import Typography from '@elementor/ui/Typography';
import { styled } from '@elementor/ui/styles';
import { useScannerWizardContext } from '@ea11y-apps/scanner/context/scanner-wizard-context';
import {
	BLOCK_INFO,
	BLOCK_TITLES,
	BLOCKS,
} from '@ea11y-apps/scanner/utils/constants';
import { removeExistingFocus } from '@ea11y-apps/scanner/utils/focus-on-element';
import { __ } from '@wordpress/i18n';

export const Breadcrumbs = () => {
	const { openedBlock, sortedViolations, setOpenedBlock } =
		useScannerWizardContext();

	const handleClick = () => {
		removeExistingFocus();
		setOpenedBlock(BLOCKS.main);
	};

	return (
		<Box>
			<BreadcrumbsBox>
				<Link
					component="button"
					color="text.secondary"
					variant="body1"
					underline="none"
					onClick={handleClick}
					sx={{ whiteSpace: 'nowrap' }}
				>
					{__('All issues', 'pojo-accessibility')}
				</Link>
				<Typography variant="body1">/</Typography>
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
							PopperProps={{
								disablePortal: true,
							}}
						>
							<InfoCircleIcon fontSize="small" />
						</Infotip>
					)}
					<Chip
						label={sortedViolations[openedBlock].length}
						color="secondary"
						variant="standard"
						size="small"
						sx={{ fontWeight: 500 }}
					/>
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
