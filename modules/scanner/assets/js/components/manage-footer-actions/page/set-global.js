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
import { SetGlobalRemediationModal } from '@ea11y-apps/scanner/components/manage-footer-actions/page/set-global-remediation-modal';
import { IS_PRO_PLAN, UPGRADE_URL } from '@ea11y-apps/scanner/constants';
import { useGlobalManageActions } from '@ea11y-apps/scanner/hooks/use-global-manage-actions';
import { StyledProChip } from '@ea11y-apps/scanner/styles/app.styles';
import { InfotipBox } from '@ea11y-apps/scanner/styles/manual-fixes.styles';
import { remediationItem } from '@ea11y-apps/scanner/types/remediation-item';
import { useState } from '@wordpress/element';
import { __ } from '@wordpress/i18n';

export const SetGlobal = ({
	item,
	onGlobalChange = null,
	isChecked = false,
}) => {
	const { setRemediationAsGlobal } = useGlobalManageActions();
	const [showModal, setShowModal] = useState(false);

	const toggleModal = () => setShowModal(!showModal);
	const onSwitchChange = (event, value) =>
		onGlobalChange ? onGlobalChange(value) : setShowModal(true);

	const onSetAsGlobal = () => {
		setShowModal(false);
		void setRemediationAsGlobal(item.id);
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
						<InfotipBox sx={{ maxWidth: '260px' }}>
							<Typography variant="subtitle2" sx={{ mb: 1 }}>
								{__('Remember this fix across scans', 'pojo-accessibility')}
							</Typography>
							<Typography variant="body2" color="text.secondary">
								{__(
									'Apply this fix automatically to pages already scanned and to future scans.',
									'pojo-accessibility',
								)}
							</Typography>
						</InfotipBox>
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
				hideConfirmation={toggleModal}
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
