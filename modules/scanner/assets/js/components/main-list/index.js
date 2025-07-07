import { BlockButton } from '@ea11y-apps/scanner/components/block-button';
import { BLOCK_TITLES, BLOCKS } from '@ea11y-apps/scanner/constants';
import { useScannerWizardContext } from '@ea11y-apps/scanner/context/scanner-wizard-context';
import { StyledBlockButtonsBox } from '@ea11y-apps/scanner/styles/app.styles';

export const MainList = () => {
	const { sortedViolations, altTextData, manualData } =
		useScannerWizardContext();

	const scannerFixExist = sortedViolations.altText.length > 0;
	const manualExist = Object.keys(sortedViolations).some(
		(key) => key !== BLOCKS.altText && sortedViolations[key]?.length,
	);

	return manualExist || scannerFixExist ? (
		<StyledBlockButtonsBox>
			{Object.keys(sortedViolations).flatMap((key) => {
				if (sortedViolations[key].length < 1) {
					return [];
				}
				const itemsData =
					key === BLOCKS.altText ? altTextData : manualData[key];

				const resolved =
					itemsData?.filter((item) => item?.resolved === true).length || 0;

				return (
					<BlockButton
						key={key}
						title={BLOCK_TITLES[key]}
						count={sortedViolations[key].length - resolved}
						block={BLOCKS[key]}
					/>
				);
			})}
		</StyledBlockButtonsBox>
	) : null;
};
