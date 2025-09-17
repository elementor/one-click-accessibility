import Chip from '@elementor/ui/Chip';
import Typography from '@elementor/ui/Typography';
import PropTypes from 'prop-types';
import { mixpanelEvents, mixpanelService } from '@ea11y-apps/global/services';
import { DeleteButton } from '@ea11y-apps/scanner/components/manage-remediation-buttons/delete-button';
import { DisableButton } from '@ea11y-apps/scanner/components/manage-remediation-buttons/disable-button';
import { EnableButton } from '@ea11y-apps/scanner/components/manage-remediation-buttons/enable-button';
import { BLOCKS } from '@ea11y-apps/scanner/constants';
import { useScannerWizardContext } from '@ea11y-apps/scanner/context/scanner-wizard-context';
import {
	ActionButton,
	ManageButtonGroup,
	ManageButtonWrap,
} from '@ea11y-apps/scanner/styles/app.styles';
import { __, sprintf } from '@wordpress/i18n';

export const ManageButton = ({ title, count, block }) => {
	const { sortedRemediation, setOpenedBlock } = useScannerWizardContext();

	const handleClick = () => {
		setOpenedBlock(block);
		mixpanelService.sendEvent(mixpanelEvents.categoryClicked, {
			page_url: window.ea11yScannerData?.pageData?.url,
			issue_count: count,
			category_name: block,
			source: 'remediation',
		});
	};

	const total = sortedRemediation[block].length;
	const disabled = block === BLOCKS.colorContrast || block === BLOCKS.altText;
	const isAllDisabled =
		sortedRemediation[block]?.length ===
		sortedRemediation[block]?.filter(
			(remediation) => !Number(remediation.active),
		)?.length;

	return (
		<ManageButtonWrap disabled={disabled}>
			<ActionButton
				variant="text"
				color="secondary"
				size="large"
				fullWidth
				onClick={handleClick}
				disabled={disabled}
			>
				<Typography noWrap variant="subtitle2" as="h4">
					{title}
				</Typography>
			</ActionButton>
			<Chip
				label={sprintf(
					// Translators: %1$s - active, %2$s - total
					__('%1$s/%2$s active', 'pojo-accessibility'),
					count,
					total,
				)}
				color={count > 0 ? 'info' : 'default'}
				variant="standard"
				size="tiny"
				disabled={count === 0}
			/>
			<ManageButtonGroup>
				{isAllDisabled ? (
					<EnableButton group={block} />
				) : (
					<DisableButton group={block} />
				)}
				<DeleteButton group={block} />
			</ManageButtonGroup>
		</ManageButtonWrap>
	);
};

ManageButton.propTypes = {
	title: PropTypes.string.isRequired,
	count: PropTypes.number.isRequired,
	block: PropTypes.string.isRequired,
};
