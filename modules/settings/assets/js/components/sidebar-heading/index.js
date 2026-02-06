import ElementorAccessibilityIcon from '@elementor/icons/ElementorAccessibilityIcon';
import Box from '@elementor/ui/Box';
import Typography from '@elementor/ui/Typography';
import { styled } from '@elementor/ui/styles';
import { useSettings } from '@ea11y/hooks';
import { __ } from '@wordpress/i18n';

const SidebarHeading = () => {
	const { openSidebar } = useSettings();

	return (
		<StyledHeader>
			<StyledIconBox>
				<ElementorAccessibilityIcon
					aria-hidden={true}
					sx={{ fontSize: '24px' }}
				/>
			</StyledIconBox>
			{openSidebar && (
				<Typography variant="subtitle1" as="div">
					{__('Accessibility', 'pojo-accessibility')}
				</Typography>
			)}
		</StyledHeader>
	);
};

export default SidebarHeading;

const StyledHeader = styled(Box)`
	display: flex;
	align-items: center;
	gap: ${({ theme }) => theme.spacing(1.5)};
	white-space: nowrap;
	line-height: 0;
	padding: 0;
`;

const StyledIconBox = styled(Box)`
	padding: ${({ theme }) => theme.spacing(1)};
	border: 1px solid ${({ theme }) => theme.palette.divider};
	border-radius: ${({ theme }) => theme.shape.borderRadius * 2}px;
	color: rgb(0 0 0 / 0.54);
`;
