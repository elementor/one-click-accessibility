import InfoCircleIcon from '@elementor/icons/InfoCircleIcon';
import Box from '@elementor/ui/Box';
import Infotip from '@elementor/ui/Infotip';
import Typography from '@elementor/ui/Typography';
import { styled } from '@elementor/ui/styles';
import { BlockButton } from '@ea11y-apps/scanner/components/block-button';
import { useScannerWizardContext } from '@ea11y-apps/scanner/context/scanner-wizard-context';
import { BLOCK_TITLES, BLOCKS } from '@ea11y-apps/scanner/utils/constants';
import { __ } from '@wordpress/i18n';

export const ManuallyFix = () => {
	const { sortedViolations } = useScannerWizardContext();

	const manualExist = Object.keys(sortedViolations).some(
		(key) => key !== BLOCKS.altText && sortedViolations[key]?.length,
	);

	return manualExist ? (
		<Box>
			<Box display="flex" alignItems="center" gap={1} sx={{ mb: 1 }}>
				<Typography variant="body2">
					{__('Manually fix', 'pojo-accessibility')}
				</Typography>

				<Infotip
					content={
						<Typography variant="body2" sx={{ p: 2, maxWidth: '300px' }}>
							{__('Some info', 'pojo-accessibility')}
						</Typography>
					}
					PopperProps={{
						disablePortal: true,
					}}
				>
					<InfoCircleIcon fontSize="small" />
				</Infotip>
			</Box>
			<StyledBlockButtonsBox>
				{Object.keys(sortedViolations).flatMap((key) => {
					if (key !== BLOCKS.altText && sortedViolations[key]?.length) {
						return (
							<BlockButton
								title={BLOCK_TITLES[key]}
								count={sortedViolations[key].length}
								block={BLOCKS[key]}
							/>
						);
					}
					return [];
				})}
			</StyledBlockButtonsBox>
		</Box>
	) : null;
};

const StyledBlockButtonsBox = styled(Box)`
	display: flex;
	flex-direction: column;
	gap: ${({ theme }) => theme.spacing(1)};
`;
