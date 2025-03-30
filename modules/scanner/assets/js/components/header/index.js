import XIcon from '@elementor/icons/XIcon';
import Box from '@elementor/ui/Box';
import Card from '@elementor/ui/Card';
import CardContent from '@elementor/ui/CardContent';
import IconButton from '@elementor/ui/IconButton';
import Typography from '@elementor/ui/Typography';
import { styled } from '@elementor/ui/styles';
import { ROOT_ID } from '@ea11y-apps/scanner/utils/constants';
import { __ } from '@wordpress/i18n';

export const Header = () => {
	const onClose = () => {
		const widget = document.getElementById(ROOT_ID);
		widget.remove();
	};

	return (
		<Card
			square={true}
			variant="elevation"
			elevation={0}
			sx={{ position: 'sticky', top: 0 }}
		>
			<StyledContent>
				<Box display="flex" justifyContent="space-between" alignItems="center">
					<Typography variant="body1">
						{__('Accessibility Scanner', 'pojo-accessibility')}
					</Typography>
					<IconButton onClick={onClose}>
						<XIcon />
					</IconButton>
				</Box>
			</StyledContent>
		</Card>
	);
};

const StyledContent = styled(CardContent)`
	padding: 16px 12px 8px;
	&:last-child {
		padding-bottom: 8px;
	}
`;
