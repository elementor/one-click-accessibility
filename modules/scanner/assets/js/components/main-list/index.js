import Box from '@elementor/ui/Box';
import { styled } from '@elementor/ui/styles';
import { BlockButton } from '@ea11y-apps/scanner/components/block-button';
import { useScannerWizardContext } from '@ea11y-apps/scanner/context/scanner-wizard-context';
import { BLOCK_TITLES, BLOCKS } from '@ea11y-apps/scanner/utils/constants';

export const MainList = () => {
	const { sortedViolations } = useScannerWizardContext();

	const scannerFixExist = sortedViolations.altText.length > 0;
	const manualExist = Object.keys(sortedViolations).some(
		(key) => key !== BLOCKS.altText && sortedViolations[key]?.length,
	);

	return manualExist || scannerFixExist ? (
		<StyledBlockButtonsBox>
			{Object.keys(sortedViolations).map((key) => {
				return (
					<BlockButton
						key={key}
						title={BLOCK_TITLES[key]}
						count={sortedViolations[key].length}
						block={BLOCKS[key]}
					/>
				);
			})}
		</StyledBlockButtonsBox>
	) : null;
};

const StyledBlockButtonsBox = styled(Box)`
	display: flex;
	flex-direction: column;
	gap: ${({ theme }) => theme.spacing(1)};
`;
