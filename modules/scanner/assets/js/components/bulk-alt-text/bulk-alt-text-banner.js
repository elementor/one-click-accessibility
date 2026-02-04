import { Typography } from '@elementor/ui';
import Chip from '@elementor/ui/Chip';
import Grid from '@elementor/ui/Grid';
import Image from '@elementor/ui/Image';
import BulkAltTextButton from '@ea11y-apps/scanner/components/bulk-alt-text/bulk-alt-text-button';
import { useScannerWizardContext } from '@ea11y-apps/scanner/context/scanner-wizard-context';
import bulk1 from '@ea11y-apps/scanner/images/bulk-1.png';
import bulk2 from '@ea11y-apps/scanner/images/bulk-2.png';
import bulk3 from '@ea11y-apps/scanner/images/bulk-3.png';
import bulk4 from '@ea11y-apps/scanner/images/bulk-4.png';
import { sprintf, _n } from '@wordpress/i18n';

const BulkAltTextBanner = () => {
	const { sortedViolations } = useScannerWizardContext();
	const bulkImages = [bulk1, bulk2, bulk3, bulk4];

	const imagesToShow =
		sortedViolations.altText.length > 3
			? 4
			: Number(sortedViolations.altText.length);

	return (
		<Grid
			container
			justifyContent="space-between"
			alignItems="center"
			paddingInline={2}
			flexWrap="nowrap"
			marginBottom={2}
			boxShadow="0 3px 14px 2px rgba(0, 0, 0, 0.12)"
			padding={2}
		>
			<Grid item container width="auto" alignItems="center" flexWrap="nowrap">
				{Array.from({ length: imagesToShow }).map((_, index) => (
					<Image
						key={index}
						src={bulkImages[index]}
						alt={`Image ${index + 1}`}
						height={44}
						sx={{
							marginInlineStart: index > 0 ? -2 : 0,
						}}
					/>
				))}
				<Chip
					label={
						<Typography fontWeight={500}>
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
			<BulkAltTextButton />
		</Grid>
	);
};

export default BulkAltTextBanner;
