import InfoCircleIcon from '@elementor/icons/InfoCircleIcon';
import WorldIcon from '@elementor/icons/WorldIcon';
import Box from '@elementor/ui/Box';
import Button from '@elementor/ui/Button';
import Infotip from '@elementor/ui/Infotip';
import Switch from '@elementor/ui/Switch';
import Typography from '@elementor/ui/Typography';
import PropTypes from 'prop-types';
import { ProCrownIcon } from '@ea11y/icons';
import CrownFilled from '@ea11y-apps/global/icons/crown-filled';
import { mixpanelEvents, mixpanelService } from '@ea11y-apps/global/services';
import { SetGlobalRemediationModal } from '@ea11y-apps/scanner/components/manage-footer-actions/page/set-global-remediation-modal';
import { IS_PRO_PLAN, UPGRADE_URL } from '@ea11y-apps/scanner/constants';
import { useScannerWizardContext } from '@ea11y-apps/scanner/context/scanner-wizard-context';
import { useGlobalManageActions } from '@ea11y-apps/scanner/hooks/use-global-manage-actions';
import infotipImageSrc from '@ea11y-apps/scanner/static/global-infotip-image.png';
import { StyledProChip } from '@ea11y-apps/scanner/styles/app.styles';
import {
	InfotipBox,
	InfotipImage,
} from '@ea11y-apps/scanner/styles/manual-fixes.styles';
import { remediationItem } from '@ea11y-apps/scanner/types/remediation-item';
import { useState } from '@wordpress/element';
import { __ } from '@wordpress/i18n';

export const SetGlobal = ({
	item,
	onGlobalChange = null,
	isChecked = false,
}) => {
	const { openedBlock } = useScannerWizardContext();
	const { setRemediationAsGlobal } = useGlobalManageActions();
	const [showModal, setShowModal] = useState(false);

	const onShowModal = () => {
		setShowModal(true);
		mixpanelService.sendEvent(mixpanelEvents.popupButtonClicked, {
			data: {
				popupType: 'set_as_global_confirmation',
				buttonName: 'Apply across scans',
			},
		});
	};

	const changeIsGlobal = (value) => {
		if (onGlobalChange) {
			onGlobalChange(value);
		}

		mixpanelService.sendEvent(mixpanelEvents.markAsGlobalToggled, {
			toggle_status: value ? 'on' : 'off',
			source: 'assistant',
			category_name: openedBlock,
			issue_type: item.message,
			rule_id: item.ruleId,
		});
	};

	const onHideModal = () => setShowModal(false);
	const onSwitchChange = (event, value) =>
		onGlobalChange ? changeIsGlobal(value) : onShowModal();

	const onSetAsGlobal = () => {
		setShowModal(false);
		void setRemediationAsGlobal(item.id);
	};

	const onUpgrade = () => {
		mixpanelService.sendEvent(mixpanelEvents.upgradeButtonClicked, {
			current_plan: window.ea11yScannerData?.planData?.plan?.name,
			feature_locked: 'globals',
		});
	};

	return (
		<Box display="flex" gap={0.5} alignItems="center">
			<Box display="flex" alignItems="center">
				<Switch
					checked={isChecked}
					size="small"
					color={isChecked ? 'info' : 'secondary'}
					onChange={onSwitchChange}
					disabled={!IS_PRO_PLAN}
				/>
				<WorldIcon color="action" fontSize="small" />
			</Box>
			<Typography variant="body2" color="action">
				{__('Apply across scans', 'pojo-accessibility')}
			</Typography>
			{IS_PRO_PLAN ? (
				<Infotip
					tabIndex="0"
					placement="top"
					PopperProps={{
						disablePortal: true,
					}}
					content={
						<>
							<InfotipImage src={infotipImageSrc} role="presentation" />
							<InfotipBox sx={{ maxWidth: '260px' }}>
								<Typography variant="subtitle2" sx={{ mb: 1 }}>
									{__('Fix once, apply everywhere', 'pojo-accessibility')}
								</Typography>
								<Typography variant="body2" color="text.secondary">
									{__(
										'Apply this fix automatically to pages already scanned and to future scans.',
										'pojo-accessibility',
									)}
								</Typography>
							</InfotipBox>
						</>
					}
				>
					<InfoCircleIcon color="action" fontSize="tiny" />
				</Infotip>
			) : (
				<Infotip
					tabIndex="0"
					placement="top"
					PopperProps={{
						disablePortal: true,
					}}
					content={
						<InfotipBox>
							<Typography variant="subtitle1" sx={{ mb: 1 }}>
								{__('Upgrade to unlock cross-scan fixes', 'pojo-accessibility')}
							</Typography>
							<Typography
								variant="body2"
								sx={{ mb: 1.5 }}
								color="text.secondary"
							>
								{__(
									'Cross-scan fixes let you resolve the same issue on all of your scanned pages with a click.',
									'pojo-accessibility',
								)}
							</Typography>
							<Box display="flex" justifyContent="flex-end">
								<Button
									size="small"
									color="promotion"
									variant="contained"
									href={UPGRADE_URL}
									target="_blank"
									rel="noreferrer"
									startIcon={<CrownFilled />}
									onClick={onUpgrade}
								>
									{__('Upgrade now', 'pojo-accessibility')}
								</Button>
							</Box>
						</InfotipBox>
					}
				>
					<StyledProChip
						color="promotion"
						variant="standard"
						icon={<ProCrownIcon />}
						size="small"
					/>
				</Infotip>
			)}
			<SetGlobalRemediationModal
				open={showModal}
				hideConfirmation={onHideModal}
				onApprove={onSetAsGlobal}
				item={item}
			/>
		</Box>
	);
};

SetGlobal.propTypes = {
	item: remediationItem,
	onGlobalChange: PropTypes.func,
	isChecked: PropTypes.bool,
};
