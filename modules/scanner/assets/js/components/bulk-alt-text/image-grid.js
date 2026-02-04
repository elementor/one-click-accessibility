import Grid from '@elementor/ui/Grid';
import ImageCard from '@ea11y-apps/scanner/components/bulk-alt-text/image-card';
import { useScannerWizardContext } from '@ea11y-apps/scanner/context/scanner-wizard-context';

const ImageGrid = () => {
	const { sortedViolations } = useScannerWizardContext();
	const altTextViolations = sortedViolations.altText;

	return (
		<Grid container spacing={2} padding={2}>
			{altTextViolations.map((image, index) => (
				<Grid item xs={3} key={`${index}-img-card`}>
					<ImageCard item={image} current={index} />
				</Grid>
			))}
		</Grid>
	);
};

export default ImageGrid;
