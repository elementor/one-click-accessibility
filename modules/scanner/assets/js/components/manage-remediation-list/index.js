import PropTypes from 'prop-types';
import { ManageButton } from '@ea11y-apps/scanner/components/block-button/manage-button';
import { BLOCK_TITLES, BLOCKS } from '@ea11y-apps/scanner/constants';
import { useScannerWizardContext } from '@ea11y-apps/scanner/context/scanner-wizard-context';
import { StyledBlockButtonsBox } from '@ea11y-apps/scanner/styles/app.styles';

const ManageRemediationList = ({ global = false }) => {
	const { sortedRemediation, sortedGlobalRemediation } =
		useScannerWizardContext();

	const remediations = global ? sortedGlobalRemediation : sortedRemediation;

	return (
		<StyledBlockButtonsBox>
			{Object.keys(remediations).flatMap((key) => {
				if (remediations[key].length < 1) {
					return [];
				}

				const resolved = remediations[key].filter(
					({ active, active_for_page: activeForPage }) =>
						global ? Number(activeForPage) : Number(active),
				).length;

				return (
					<ManageButton
						key={key}
						title={BLOCK_TITLES[key]}
						count={resolved}
						block={BLOCKS[key]}
						global={global}
					/>
				);
			})}
		</StyledBlockButtonsBox>
	);
};

ManageRemediationList.propTypes = {
	global: PropTypes.bool,
};

export default ManageRemediationList;
