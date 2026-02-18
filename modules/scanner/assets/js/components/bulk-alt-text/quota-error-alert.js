import Alert from '@elementor/ui/Alert';
import AlertTitle from '@elementor/ui/AlertTitle';
import Button from '@elementor/ui/Button';
import { COMPARE_PLAN_URL } from '@ea11y-apps/scanner/constants';
import { useBulkGeneration } from '@ea11y-apps/scanner/context/bulk-generation-context';
import { useState } from '@wordpress/element';
import { __, sprintf } from '@wordpress/i18n';

const QuotaErrorAlert = () => {
	const { quotaError, progress } = useBulkGeneration();
	const [isDismissed, setIsDismissed] = useState(false);

	if (!quotaError || isDismissed) {
		return null;
	}

	const generatedCount = progress?.completed || 0;
	const totalCount = progress?.total || 0;

	return (
		<Alert
			severity="error"
			variant="standard"
			role="alert"
			aria-live="assertive"
			sx={{ margin: 2 }}
			onClose={() => setIsDismissed(true)}
			action={
				<Button
					size="small"
					color="error"
					variant="outlined"
					href={COMPARE_PLAN_URL}
					target="_blank"
					rel="noreferrer"
				>
					{__('Compare plans', 'pojo-accessibility')}
				</Button>
			}
		>
			<AlertTitle>
				{__('Some images could not be generated.', 'pojo-accessibility')}
			</AlertTitle>
			{sprintf(
				// Translators: %1$d generated count, %2$d total count
				__(
					'We generated %1$d/%2$d images before credits ran out — upgrade your plan or wait until next month.',
					'pojo-accessibility',
				),
				generatedCount,
				totalCount,
			)}
		</Alert>
	);
};

export default QuotaErrorAlert;
