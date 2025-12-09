import Typography from '@elementor/ui/Typography';
import { styled } from '@elementor/ui/styles';
import { useSettings } from '@ea11y/hooks';
import { UserCheckIcon } from '@ea11y/icons';
import { __ } from '@wordpress/i18n';

const SidebarHeading = () => {
	const { openSidebar } = useSettings();

	return (
		<StyledHeader>
			<StyledUserCheckIcon
				role="img"
				sx={{
					margin: openSidebar ? 0 : '0 auto',
					padding: 1.25,
				}}
			/>
			{openSidebar && (
				<Typography variant="subtitle1" as="div">
					{__('Accessibility', 'pojo-accessibility')}
				</Typography>
			)}
		</StyledHeader>
	);
};

export default SidebarHeading;

const StyledHeader = styled('div')`
	display: flex;
	align-items: center;
	gap: ${({ theme }) => theme.spacing(1.5)};
	white-space: nowrap;
	padding: 0;
`;

const StyledUserCheckIcon = styled(UserCheckIcon)`
	font-size: 2.75rem;
	padding: ${({ theme }) => theme.spacing(1)};
	border: 1px solid ${({ theme }) => theme.palette.divider};
	border-radius: ${({ theme }) => theme.spacing(1)};
`;
