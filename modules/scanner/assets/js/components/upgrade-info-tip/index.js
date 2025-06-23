import Infotip from '@elementor/ui/Infotip';
import PropTypes from 'prop-types';
import { UpgradeContent } from '@ea11y-apps/scanner/components/upgrade-info-tip/upgrade-content';

export const UpgradeInfoTip = ({ closeUpgrade, openUpgrade, children }) => {
	return (
		<Infotip
			placement="top"
			onClose={closeUpgrade}
			open={openUpgrade}
			disableFocusListener
			disableHoverListener
			disableTouchListener
			PopperProps={{
				disablePortal: true,
			}}
			content={<UpgradeContent closeUpgrade={closeUpgrade} />}
		>
			{children}
		</Infotip>
	);
};

UpgradeInfoTip.propTypes = {
	closeUpgrade: PropTypes.func.isRequired,
	openUpgrade: PropTypes.bool.isRequired,
	children: PropTypes.node,
};
