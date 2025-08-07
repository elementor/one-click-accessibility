import { ManageButton } from '@ea11y-apps/scanner/components/block-button/manage-button';
import { BLOCK_TITLES, BLOCKS } from '@ea11y-apps/scanner/constants';
import { useScannerWizardContext } from '@ea11y-apps/scanner/context/scanner-wizard-context';
import { StyledBlockButtonsBox } from '@ea11y-apps/scanner/styles/app.styles';

export const ManageList = () => {
	const { sortedRemediation } = useScannerWizardContext();

	return (
		<StyledBlockButtonsBox>
			{Object.keys(sortedRemediation).flatMap((key) => {
				if (sortedRemediation[key].length < 1) {
					return [];
				}

				const resolved =
					sortedRemediation[key].filter((item) => Number(item.active)).length ||
					0;

				return (
					<ManageButton
						key={key}
						title={BLOCK_TITLES[key]}
						count={resolved}
						block={BLOCKS[key]}
					/>
				);
			})}
		</StyledBlockButtonsBox>
	);
};
