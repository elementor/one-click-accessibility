import { CrownIcon } from '@elementor/icons';
import Button from '@elementor/ui/Button';
import Card from '@elementor/ui/Card';
import CardActions from '@elementor/ui/CardActions';
import CardContent from '@elementor/ui/CardContent';
import CardHeader from '@elementor/ui/CardHeader';
import Chip from '@elementor/ui/Chip';
import Infotip from '@elementor/ui/Infotip';
import Typography from '@elementor/ui/Typography';
import { styled } from '@elementor/ui/styles';
import { ProCrownIcon } from '@ea11y/icons';
import { __ } from '@wordpress/i18n';

const ProItemInfotip = () => {
	const infotipContent = (
		<Card elevation={0} sx={{ maxWidth: 300 }}>
			<CardHeader
				title={__('Access more advanced features', 'pojo-accessibility')}
			/>
			<CardContent>
				<Typography variant="body2" color="text.secondary">
					{__(
						'Upgrade to get more customization and other pro features to boost your site.',
						'pojo-accessibility',
					)}
				</Typography>
			</CardContent>
			<CardActions>
				<Button
					size="medium"
					color="promotion"
					variant="contained"
					startIcon={<CrownIcon />}
				>
					{__('Upgrade now', 'pojo-accessibility')}
				</Button>
			</CardActions>
		</Card>
	);

	return (
		<Infotip
			placement="top"
			content={infotipContent}
			disableFocusListener
			PopperProps={{
				sx: {
					zIndex: 9999999999, // Custom z-index for the popper
				},
			}}
		>
			<StyledChip
				color="promotion"
				variant="standard"
				icon={<ProCrownIcon />}
				size="small"
			/>
		</Infotip>
	);
};

export default ProItemInfotip;

const StyledChip = styled(Chip)`
	.MuiChip-label {
		padding: 4px;
	}
`;
