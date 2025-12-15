import WorldIcon from '@elementor/icons/WorldIcon';
import Chip from '@elementor/ui/Chip';
import Typography from '@elementor/ui/Typography';
import PropTypes from 'prop-types';
import { mixpanelEvents, mixpanelService } from '@ea11y-apps/global/services';
import { ButtonMenu } from '@ea11y-apps/scanner/components/block-button/button-menu';
import { GlobalButtonMenu } from '@ea11y-apps/scanner/components/block-button/global-button-menu';
import { useScannerWizardContext } from '@ea11y-apps/scanner/context/scanner-wizard-context';
import {
	ActionButton,
	ManageButtonWrap,
} from '@ea11y-apps/scanner/styles/app.styles';
import { __, sprintf } from '@wordpress/i18n';

export const ManageButton = ({ title, count, block, global = false }) => {
	const {
		sortedRemediation,
		sortedGlobalRemediation,
		setOpenedBlock,
		setIsManageGlobal,
	} = useScannerWizardContext();

	const handleClick = () => {
		setOpenedBlock(block);
		setIsManageGlobal(global);
		mixpanelService.sendEvent(mixpanelEvents.categoryClicked, {
			page_url: window.ea11yScannerData?.pageData?.url,
			issue_count: count,
			category_name: block,
			source: 'remediation',
		});
	};

	const remediations = global ? sortedGlobalRemediation : sortedRemediation;
	const total = remediations[block].length;

	return (
		<ManageButtonWrap>
			<ActionButton
				variant="text"
				color="secondary"
				size="large"
				fullWidth
				onClick={handleClick}
			>
				<Typography noWrap variant="subtitle2" as="h4" color="text.primary">
					{title}
				</Typography>
			</ActionButton>
			<Chip
				icon={global ? <WorldIcon fontSize="small" /> : null}
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
			{global ? (
				<GlobalButtonMenu group={block} />
			) : (
				<ButtonMenu group={block} />
			)}
		</ManageButtonWrap>
	);
};

ManageButton.propTypes = {
	title: PropTypes.string.isRequired,
	count: PropTypes.number.isRequired,
	block: PropTypes.string.isRequired,
	global: PropTypes.bool,
};
