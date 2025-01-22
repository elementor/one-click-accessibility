import Card from '@elementor/ui/Card';
import CardContent from '@elementor/ui/CardContent';
import CardHeader from '@elementor/ui/CardHeader';
import Typography from '@elementor/ui/Typography';
import { styled } from '@elementor/ui/styles';
import { WidgetLoader } from '@ea11y/components';
import { __ } from '@wordpress/i18n';

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
`;

const WidgetPreview = () => {
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

				<StyledPreview id="ea11y-widget-preview--container"></StyledPreview>
			</Card>
			<WidgetLoader />
		</>
	);
};

export default WidgetPreview;
