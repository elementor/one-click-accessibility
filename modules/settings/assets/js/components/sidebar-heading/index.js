import ElementorAccessibilityIcon from '@elementor/icons/ElementorAccessibilityIcon';
import Typography from '@elementor/ui/Typography';
import { styled } from '@elementor/ui/styles';
import { useSettings } from '@ea11y/hooks';
import { __ } from '@wordpress/i18n';

const SidebarHeading = () => {
	const { openSidebar } = useSettings();

	return (
		<StyledHeader>
			<StyledHeaderIcon
				aria-hidden={true}
				sx={{ margin: openSidebar ? 0 : '0 auto' }}
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

/* TODO: Replace the icon when marketing decide which icon to use */
const StyledHeaderIcon = styled(ElementorAccessibilityIcon)`
	font-size: 2.5rem;
	padding: ${({ theme }) => theme.spacing(0.75)};
	border: 1px solid ${({ theme }) => theme.palette.divider};
	border-radius: ${({ theme }) => theme.shape.borderRadius * 2}px;
	color: rgb(0 0 0 / 0.54);
`;
