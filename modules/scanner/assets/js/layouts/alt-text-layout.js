import Card from '@elementor/ui/Card';
import CardContent from '@elementor/ui/CardContent';
import Typography from '@elementor/ui/Typography';
import { useScannerWizardContext } from '@ea11y-apps/scanner/context/scanner-wizard-context';
import { StyledContent } from '@ea11y-apps/scanner/styles/app.styles';

export const AltTextLayout = () => {
	const { sortedViolations } = useScannerWizardContext();
	console.log(sortedViolations.altText);
	return (
		<StyledContent>
			{sortedViolations.altText.map((item, index) => (
				<Card key={`${item.ruleId}-${index}`} sx={{ mb: 2 }}>
					<CardContent>
						<Typography variant="subtitle1">{item.category}</Typography>
						<Typography variant="body1">{item.message}</Typography>
					</CardContent>
				</Card>
			))}
		</StyledContent>
	);
};
