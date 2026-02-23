import Chip from '@elementor/ui/Chip';
import Grid from '@elementor/ui/Grid';
import Typography from '@elementor/ui/Typography';
import { styled } from '@elementor/ui/styles';
import BulkAltTextButton from '@ea11y-apps/scanner/components/bulk-alt-text/bulk-alt-text-button';
import BulkBannerImageStack from '@ea11y-apps/scanner/components/bulk-alt-text/bulk-banner-image-stack';
import { useScannerWizardContext } from '@ea11y-apps/scanner/context/scanner-wizard-context';
import bulk1 from '@ea11y-apps/scanner/images/bulk-1.png';
import bulk2 from '@ea11y-apps/scanner/images/bulk-2.png';
import bulk3 from '@ea11y-apps/scanner/images/bulk-3.png';
import bulk4 from '@ea11y-apps/scanner/images/bulk-4.png';
import { sprintf, _n } from '@wordpress/i18n';

const BulkAltTextBanner = () => {
	const { sortedViolations } = useScannerWizardContext();
	const bulkImages = [bulk1, bulk2, bulk3, bulk4];

	if (sortedViolations.altText.length <= 2) {
		return null;
	}

	const imagesToShow =
		sortedViolations.altText.length > 3
			? 4
			: Number(sortedViolations.altText.length);

	return (
		<StyledBannerGrid container>
			<Grid item container width="auto" alignItems="center" flexWrap="nowrap">
				<BulkBannerImageStack images={bulkImages} count={imagesToShow} />
				<Chip
					label={
						<Typography fontSize={12} fontWeight={500}>
							{sprintf(
								// Translators: %d number of images
								_n('%d image', '%d images', 14, 'pojo-accessibility'),
								sortedViolations.altText.length,
							)}
						</Typography>
					}
					size="tiny"
					color="info"
					sx={{ marginInlineStart: -2 }}
				/>
			</Grid>
			<Grid item>
				<BulkAltTextButton />
			</Grid>
		</StyledBannerGrid>
	);
};

export default BulkAltTextBanner;

const StyledBannerGrid = styled(Grid)(({ theme }) => ({
	justifyContent: 'space-between',
	alignItems: 'center',
	paddingInline: theme.spacing(3),
	flexWrap: 'nowrap',
	marginBottom: theme.spacing(2),
	boxShadow: 'rgba(0, 0, 0, 0.12) 0px 10px 14px -8px',
	paddingBlock: theme.spacing(1.25),
}));
