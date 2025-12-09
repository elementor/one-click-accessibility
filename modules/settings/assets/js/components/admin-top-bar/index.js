import AppBar from '@elementor/ui/AppBar';
import Toolbar from '@elementor/ui/Toolbar';
import { styled } from '@elementor/ui/styles';
import HelpMenu from '../help-menu';

const StyledToolbar = styled(Toolbar)`
	justify-content: end;
	align-items: center;
	flex-direction: row;
	background-color: ${({ theme }) => theme.palette.background.default};
	gap: 10px;
	border-bottom: 1px solid ${({ theme }) => theme.palette.divider};
`;

const AdminTopBar = () => {
	return (
		<AppBar position="static">
			<StyledToolbar variant="dense">
				<HelpMenu />
			</StyledToolbar>
		</AppBar>
	);
};

export default AdminTopBar;
