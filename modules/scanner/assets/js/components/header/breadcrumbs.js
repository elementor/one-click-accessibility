import InfoCircleIcon from '@elementor/icons/InfoCircleIcon';
import { Badge } from '@elementor/ui';
import Box from '@elementor/ui/Box';
import Divider from '@elementor/ui/Divider';
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
import { __ } from '@wordpress/i18n';

export const Breadcrumbs = () => {
	const { openedBlock, sortedViolations, setOpenedBlock } =
		useScannerWizardContext();

	const handleClick = () => {
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
					<Badge
						badgeContent={sortedViolations[openedBlock].length}
						color="secondary"
						variant="standard"
						sx={{ ml: 1.5 }}
					/>
				</Box>
			</BreadcrumbsBox>
			<Divider />
		</Box>
	);
};

const BreadcrumbsBox = styled(Box)`
	display: flex;
	align-items: center;
	gap: ${({ theme }) => theme.spacing(1)};
	margin-bottom: ${({ theme }) => theme.spacing(1)};
`;
