import Box from '@elementor/ui/Box';
import Drawer from '@elementor/ui/Drawer';
import IconButton from '@elementor/ui/IconButton';
import Typography from '@elementor/ui/Typography';
import { styled } from '@elementor/ui/styles';
import PropTypes from 'prop-types';
import CloseIcon from '@ea11y/icons/close-icon';
import { __ } from '@wordpress/i18n';

const StyledDrawer = styled(Drawer)`
	.MuiDrawer-paper {
		top: 32px;

		width: 320px;
		height: calc(100vh - 32px);
	}
`;

const StyledHeader = styled('header')`
	display: flex;
	justify-content: space-between;
	align-items: center;

	padding: 8px 16px;
	border-bottom: 1px solid rgba(0, 0, 0, 0.12);
`;

const StyledContent = styled(Box)`
	padding: 24px 16px;
`;

const WhatsNewDrawerBase = ({ isOpen, onClose, children }) => {
	return (
		<>
			<StyledDrawer open={isOpen} onClose={onClose} anchor="right">
				<StyledHeader>
					<Typography variant="overline" as="h1">
						{__("What's New", 'image-optimization')}
					</Typography>

					<IconButton
						onClick={onClose}
						aria-label={__('Close notifications', 'image-optimization')}
					>
						<CloseIcon size={20} />
					</IconButton>
				</StyledHeader>

				<StyledContent>{children}</StyledContent>
			</StyledDrawer>
		</>
	);
};

WhatsNewDrawerBase.propTypes = {
	onClose: PropTypes.func.isRequired,
	children: PropTypes.node,
};

export default WhatsNewDrawerBase;
