import Chip from '@elementor/ui/Chip';
import Typography from '@elementor/ui/Typography';
import PropTypes from 'prop-types';
import { mixpanelEvents, mixpanelService } from '@ea11y-apps/global/services';
import { ButtonMenu } from '@ea11y-apps/scanner/components/block-button/button-menu';
import { BLOCKS } from '@ea11y-apps/scanner/constants';
import { useScannerWizardContext } from '@ea11y-apps/scanner/context/scanner-wizard-context';
import {
	ActionButton,
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
			<ButtonMenu group={block} />
		</ManageButtonWrap>
	);
};

ManageButton.propTypes = {
	title: PropTypes.string.isRequired,
	count: PropTypes.number.isRequired,
	block: PropTypes.string.isRequired,
};
