import Alert from '@elementor/ui/Alert';
import AlertTitle from '@elementor/ui/AlertTitle';
import Button from '@elementor/ui/Button';
import Divider from '@elementor/ui/Divider';
import Typography from '@elementor/ui/Typography';
import PropTypes from 'prop-types';
import { ColorSet } from '@ea11y-apps/scanner/components/color-contrast-form/color-set';
import { ParentSelector } from '@ea11y-apps/scanner/components/color-contrast-form/parent-selector';
import { useColorContrastForm } from '@ea11y-apps/scanner/hooks/use-color-contrast-form';
import { StyledBox } from '@ea11y-apps/scanner/styles/app.styles';
import { scannerItem } from '@ea11y-apps/scanner/types/scanner-item';
import { checkContrastAA } from '@ea11y-apps/scanner/utils/calc-color-ratio';
import { __ } from '@wordpress/i18n';

export const ColorContrastForm = ({ items, current, setCurrent }) => {
	const item = items[current];
	const {
		color,
		background,
		parents,
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

	const isReady = color && background && parents;
	const colorData = isReady
		? checkContrastAA(color, background, item.node)
		: null;

	return isReady ? (
		<StyledBox>
			<Divider />
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
			/>
			<ColorSet
				title={__('Background', 'pojo-accessibility')}
				color={background}
				initialColor={item.messageArgs[4]}
				setColor={changeBackground}
			/>
			<ParentSelector
				parents={parents}
				setParentSmaller={setParentSmaller}
				setParentLarger={setParentLarger}
			/>
			<Alert severity={colorData.passesAA ? 'success' : 'error'}>
				<AlertTitle sx={{ mr: 1 }}>
					{__('Contrast level:', 'pojo-accessibility')}
				</AlertTitle>
				{colorData.ratio}
			</Alert>
			<Button
				variant="contained"
				size="small"
				color="info"
				disabled={!colorData.passesAA}
				onClick={onSubmit}
			>
				{__('Apply changes', 'pojo-accessibility')}
			</Button>
		</StyledBox>
	) : null;
};

ColorContrastForm.propTypes = {
	items: PropTypes.arrayOf(scannerItem).isRequired,
	current: PropTypes.number.isRequired,
	setCurrent: PropTypes.func.isRequired,
};
