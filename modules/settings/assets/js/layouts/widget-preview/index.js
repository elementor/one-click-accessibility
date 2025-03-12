import Card from '@elementor/ui/Card';
import CardContent from '@elementor/ui/CardContent';
import CardHeader from '@elementor/ui/CardHeader';
import Typography from '@elementor/ui/Typography';
import { styled } from '@elementor/ui/styles';
import { WidgetLoader } from '@ea11y/components';
import { useState } from '@wordpress/element';
import { __ } from '@wordpress/i18n';
import { WIDGET_PREVIEW_ID } from '../../constants';
import WidgetPreviewSkeleton from './preview-skeleton';

const StyledPreview = styled(CardContent)`
	margin-right: auto;
	margin-left: auto;
	margin-top: ${({ theme }) => theme.spacing(4)};
	padding: 0 24px;

	overflow: auto;

	& #ea11y-root {
		position: absolute;
		top: 0;
		left: 0;
		right: 0;

		transform: scale(70%);
	}

	& #ea11y-root #ea11y-widget-container {
		position: initial;
		transform: translateY(0);
	}

	@media screen and (max-height: 850px) {
		& #ea11y-root {
			top: -25px;
			transform: scale(60%);
		}
	}
`;

const WidgetPreview = () => {
	const [isLoaded, setIsLoaded] = useState(false);

	return (
		<>
			<Card variant="outlined">
				<CardHeader
					title={__('Preview', 'pojo-accessibility')}
					subheader={
						<Typography variant="body2">
							{__(
								'This is what the widget will look like to your site viewers.',
								'pojo-accessibility',
							)}
						</Typography>
					}
					sx={{ paddingBottom: 0 }}
				/>

				<StyledPreview id={WIDGET_PREVIEW_ID}>
					{!isLoaded && <WidgetPreviewSkeleton />}
				</StyledPreview>
			</Card>

			<WidgetLoader
				onLoad={() => {
					setIsLoaded(true);

					if (document.getElementById(WIDGET_PREVIEW_ID)) {
						window?.ea11yWidget?.widget?.open();
					}
				}}
			/>
		</>
	);
};

export default WidgetPreview;
