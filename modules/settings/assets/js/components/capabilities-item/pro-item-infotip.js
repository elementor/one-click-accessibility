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
import { GOLINKS, PRO_FEATURES } from '../../constants/index';
import { openLink } from '../../utils/index';

const ProItemInfotip = ({
	children,
	childKey,
	source,
	enabled,
	childValue,
	showIcon = false,
}) => {
	/*
	 * Handle the upgrade button click.
	 */
	const handleUpgradeButton = () => {
		if ('screen-reader' === childKey && 'icon' === source) {
			openLink(GOLINKS.SCREEN_READER_ICON);
		}

		if ('screen-reader' === childKey && 'toggle' === source) {
			openLink(GOLINKS.SCREEN_READER_TOGGLE);
		}

		if (PRO_FEATURES.REMOVE_BRANDING === childKey && 'icon' === source) {
			openLink(GOLINKS.ALLY_LABEL_ICON);
		}

		if (PRO_FEATURES.REMOVE_BRANDING === childKey && 'toggle' === source) {
			openLink(GOLINKS.ALLY_LABEL_TOGGLE);
		}
	};

	/*
	 * The content of the infotip.
	 */
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
					onClick={handleUpgradeButton}
				>
					{__('Upgrade now', 'pojo-accessibility')}
				</Button>
			</CardActions>
		</Card>
	);

	if (!childValue?.pro && 'pro' !== childValue) {
		return children;
	}

	if ((childValue?.pro || 'pro' === childValue) && enabled) {
		return children;
	}

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
			{showIcon && (
				<StyledChip
					color="promotion"
					variant="standard"
					icon={<ProCrownIcon />}
					size="small"
				/>
			)}
			{children}
		</Infotip>
	);
};

export default ProItemInfotip;

const StyledChip = styled(Chip)`
	.MuiChip-label {
		padding: 4px;
	}
`;
