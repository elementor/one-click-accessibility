import XIcon from '@elementor/icons/XIcon';
import Box from '@elementor/ui/Box';
import Card from '@elementor/ui/Card';
import CardContent from '@elementor/ui/CardContent';
import Divider from '@elementor/ui/Divider';
import IconButton from '@elementor/ui/IconButton';
import Typography from '@elementor/ui/Typography';
import { styled } from '@elementor/ui/styles';
import { ScanStats } from '@ea11y-apps/scanner/components/header/scan-stats';
import { ROOT_ID } from '@ea11y-apps/scanner/utils/constants';
import { __ } from '@wordpress/i18n';

export const Header = () => {
	const onClose = () => {
		const widget = document.getElementById(ROOT_ID);
		widget.remove();
	};

	return (
		<StyledCard square={true} variant="elevation" elevation={0}>
			<StyledContent>
				<Box display="flex" justifyContent="space-between" alignItems="center">
					<Typography variant="subtitle1">
						{__('Accessibility Scanner', 'pojo-accessibility')}
					</Typography>
					<IconButton onClick={onClose}>
						<XIcon />
					</IconButton>
				</Box>
				<ScanStats />
			</StyledContent>
			<Divider />
		</StyledCard>
	);
};

const StyledCard = styled(Card)`
	position: sticky;
	top: 0;
	z-index: 2;
`;

const StyledContent = styled(CardContent)`
	display: flex;
	flex-direction: column;
	gap: 12px;
	padding: 16px 12px;
	&:last-child {
		padding-bottom: 12px;
	}
`;
