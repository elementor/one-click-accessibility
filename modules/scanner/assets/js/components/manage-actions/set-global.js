import InfoCircleIcon from '@elementor/icons/InfoCircleIcon';
import WorldIcon from '@elementor/icons/WorldIcon';
import Box from '@elementor/ui/Box';
import Infotip from '@elementor/ui/Infotip';
import Switch from '@elementor/ui/Switch';
import Typography from '@elementor/ui/Typography';
import PropTypes from 'prop-types';
import { SetGlobalRemediationModal } from '@ea11y-apps/scanner/components/manage-actions/set-global-remediation-modal';
import { InfotipBox } from '@ea11y-apps/scanner/styles/manual-fixes.styles';
import { remediationItem } from '@ea11y-apps/scanner/types/remediation-item';
import { useState } from '@wordpress/element';
import { __ } from '@wordpress/i18n';

export const SetGlobal = ({
	item,
	onGlobalChange = null,
	isChecked = false,
}) => {
	const [showModal, setShowModal] = useState(false);

	const toggleModal = () => setShowModal(!showModal);
	const onSwitchChange = (event, value) =>
		onGlobalChange ? onGlobalChange(value) : setShowModal(true);

	return (
		<Box display="flex" gap={0.5} alignItems="center">
			<Switch
				checked={isChecked}
				size="small"
				color={isChecked ? 'info' : 'secondary'}
				onChange={onSwitchChange}
			/>
			<WorldIcon color="action" fontSize="small" />
			<Typography variant="body2" color="action">
				{__('Apply across scans', 'pojo-accessibility')}
			</Typography>
			<Infotip
				tabIndex="0"
				placement="top"
				PopperProps={{
					disablePortal: true,
				}}
				content={
					<InfotipBox>
						<Typography variant="subtitle2">
							{__('Remember this fix across scans', 'pojo-accessibility')}
						</Typography>
						<Typography variant="body2">
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
			<SetGlobalRemediationModal
				open={showModal}
				hideConfirmation={toggleModal}
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
