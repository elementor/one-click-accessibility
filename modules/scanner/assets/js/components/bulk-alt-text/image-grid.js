import Alert from '@elementor/ui/Alert';
import AlertTitle from '@elementor/ui/AlertTitle';
import ErrorBoundary from '@elementor/ui/ErrorBoundary';
import Grid from '@elementor/ui/Grid';
import ImageCard from '@ea11y-apps/scanner/components/bulk-alt-text/image-card';
import { useScannerWizardContext } from '@ea11y-apps/scanner/context/scanner-wizard-context';
import { __ } from '@wordpress/i18n';

const ImageCardErrorFallback = () => (
	<Alert severity="error" variant="outlined">
		<AlertTitle>{__('Error', 'pojo-accessibility')}</AlertTitle>
		{__(
			'This image card failed to load. Please refresh and try again.',
			'pojo-accessibility',
		)}
	</Alert>
);

const ImageGrid = () => {
	const { sortedViolations } = useScannerWizardContext();
	const altTextViolations = sortedViolations.altText;

	return (
		<Grid container padding={4} columnGap={2} rowGap={4}>
			{altTextViolations.map((image, index) => {
				const stableKey =
					image.path?.dom || image.node?.src || `img-card-${index}`;
				return (
					<Grid item key={stableKey}>
						<ErrorBoundary fallback={<ImageCardErrorFallback />}>
							<ImageCard item={image} current={index} />
						</ErrorBoundary>
					</Grid>
				);
			})}
		</Grid>
	);
};

export default ImageGrid;
