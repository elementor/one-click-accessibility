import Alert from '@elementor/ui/Alert';
import AlertTitle from '@elementor/ui/AlertTitle';
import Box from '@elementor/ui/Box';
import Button from '@elementor/ui/Button';
import Divider from '@elementor/ui/Divider';
import Typography from '@elementor/ui/Typography';
import PropTypes from 'prop-types';
import { mixpanelEvents, mixpanelService } from '@ea11y-apps/global/services';
import { ColorSet } from '@ea11y-apps/scanner/components/color-contrast-form/color-set';
import { ParentSelector } from '@ea11y-apps/scanner/components/color-contrast-form/parent-selector';
import { BLOCKS } from '@ea11y-apps/scanner/constants';
import { useColorContrastForm } from '@ea11y-apps/scanner/hooks/use-color-contrast-form';
import { StyledBox } from '@ea11y-apps/scanner/styles/app.styles';
import { scannerItem } from '@ea11y-apps/scanner/types/scanner-item';
import {
	checkContrastAA,
	isLargeText,
} from '@ea11y-apps/scanner/utils/calc-color-ratio';
import { __, sprintf } from '@wordpress/i18n';

export const ColorContrastForm = ({ items, current, setCurrent }) => {
	const item = items[current];
	const {
		color,
		background,
		parents,
		resolved,
		backgroundChanged,
		loading,
		changeColor,
		changeBackground,
		setParentSmaller,
		setParentLarger,
		onSubmit,
	} = useColorContrastForm({
		item,
		current,
		setCurrent,
	});

	const isPossibleToResolve = item.messageArgs[3] && item.messageArgs[4];

	const passRatio = isLargeText(item.node) ? '3:1' : '4.5:1';

	const colorData =
		color && background
			? checkContrastAA(color, background, item.node)
			: {
					ratio: item.messageArgs[0],
					passesAA: false,
				};

	const handleSubmit = async () => {
		await onSubmit();
		mixpanelService.sendEvent(mixpanelEvents.applyFixButtonClicked, {
			fix_method: 'color contrast',
			issue_type: item.message,
			current_contrast_ratio: colorData.ratio,
			background_level: parents.length,
			category_name: BLOCKS.colorContrast,
			page_url: window.ea11yScannerData?.pageData?.url,
		});
	};

	return (
		<StyledBox>
			<Divider />
			{!isPossibleToResolve ? (
				<>
					<Box>
						<Typography variant="subtitle2" as="h5" sx={{ mb: 1 }}>
							{__('What’s the issue?', 'pojo-accessibility')}
						</Typography>
						<Typography variant="body2" as="p">
							{__(
								'Adjust the text or background lightness until the indicator shows an accessible level.',
								'pojo-accessibility',
							)}
						</Typography>
					</Box>
					<Box>
						<Typography variant="subtitle2" as="h5" sx={{ mb: 1 }}>
							{__('How to resolve?', 'pojo-accessibility')}
						</Typography>
						<Typography variant="body2" as="p">
							{sprintf(
								// Translators: %s - color ratio
								__(
									'To meet accessibility standards, update the text or background color to reach a contrast ratio of at least %s',
									'pojo-accessibility',
								),
								passRatio,
							)}
						</Typography>
					</Box>
				</>
			) : (
				<>
					<Typography variant="body2" as="p">
						{__(
							'Adjust the text or background lightness until the indicator shows an accessible level.',
							'pojo-accessibility',
						)}
					</Typography>
					<ColorSet
						title={__('Text', 'pojo-accessibility')}
						color={color}
						initialColor={item.messageArgs[3]}
						setColor={changeColor}
						area="color"
					/>
					<ColorSet
						title={__('Background', 'pojo-accessibility')}
						color={background}
						initialColor={item.messageArgs[4]}
						setColor={changeBackground}
						area="background"
					/>
				</>
			)}

			{backgroundChanged && (
				<ParentSelector
					parents={parents}
					setParentSmaller={setParentSmaller}
					setParentLarger={setParentLarger}
				/>
			)}
			<Alert severity={colorData.passesAA ? 'success' : 'error'}>
				<AlertTitle sx={{ mr: 1 }}>
					{__('Contrast level:', 'pojo-accessibility')}
				</AlertTitle>
				{colorData.ratio}
			</Alert>
			{isPossibleToResolve && (
				<Button
					variant="contained"
					size="small"
					color="info"
					loading={loading}
					disabled={!colorData.passesAA || resolved || loading}
					onClick={handleSubmit}
				>
					{__('Apply changes', 'pojo-accessibility')}
				</Button>
			)}
		</StyledBox>
	);
};

ColorContrastForm.propTypes = {
	items: PropTypes.arrayOf(scannerItem).isRequired,
	current: PropTypes.number.isRequired,
	setCurrent: PropTypes.func.isRequired,
};
