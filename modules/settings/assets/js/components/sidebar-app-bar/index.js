import AppBar from '@elementor/ui/AppBar';
import Box from '@elementor/ui/Box';
import IconButton from '@elementor/ui/IconButton';
import Toolbar from '@elementor/ui/Toolbar';
import Typography from '@elementor/ui/Typography';
import { styled } from '@elementor/ui/styles';
import { useSettings } from '@ea11y/hooks';
import { AppLogo, SquareRoundedChevronsLeft } from '@ea11y/icons';
import { __ } from '@wordpress/i18n';

const StyledHeading = styled(Box)`
	display: flex;
	align-items: center;
	justify-content: flex-start;
	padding: 0;
	width: 200px;
`;

const SidebarAppBar = () => {
	const { openSidebar, setOpenSidebar } = useSettings();

	return (
		<AppBar position="static" color="transparent" elevation={0}>
			<Toolbar
				disableGutters
				variant="dense"
				sx={{ justifyContent: 'space-between' }}
			>
				<StyledHeading>
					<AppLogo />

					<StyledTitle variant="h6" display={!openSidebar ? 'none' : 'inherit'}>
						{__('Ally', 'pojo-accessibility')}
					</StyledTitle>
				</StyledHeading>

				<IconButton
					color="inherit"
					onClick={() => setOpenSidebar(!openSidebar)}
					size="small"
				>
					<SquareRoundedChevronsLeft
						role="img"
						aria-label={__('Toggle sidebar', 'pojo-accessibility')}
						sx={{ rotate: !openSidebar ? '180deg' : '0' }}
					/>
				</IconButton>
			</Toolbar>
		</AppBar>
	);
};

const StyledTitle = styled(Typography)`
	margin-inline-start: ${({ theme }) => theme.spacing(0.5)};
`;

export default SidebarAppBar;
