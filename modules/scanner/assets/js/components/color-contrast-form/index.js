import Alert from '@elementor/ui/Alert';
import AlertTitle from '@elementor/ui/AlertTitle';
import Box from '@elementor/ui/Box';
import Button from '@elementor/ui/Button';
import Divider from '@elementor/ui/Divider';
import Typography from '@elementor/ui/Typography';
import PropTypes from 'prop-types';
import { mixpanelEvents, mixpanelService } from '@ea11y-apps/global/services';
import { rgbOrRgbaToHex } from '@ea11y-apps/global/utils/color-contrast-helpers';
import { ColorSet } from '@ea11y-apps/scanner/components/color-contrast-form/color-set';
import { ColorSetDisabled } from '@ea11y-apps/scanner/components/color-contrast-form/color-set-disabled';
import { ParentSelector } from '@ea11y-apps/scanner/components/color-contrast-form/parent-selector';
import { SetGlobal } from '@ea11y-apps/scanner/components/manage-actions/set-global';
import { BLOCKS } from '@ea11y-apps/scanner/constants';
import { useColorContrastForm } from '@ea11y-apps/scanner/hooks/use-color-contrast-form';
import { StyledBox } from '@ea11y-apps/scanner/styles/app.styles';
import { scannerItem } from '@ea11y-apps/scanner/types/scanner-item';
import { checkContrastAA } from '@ea11y-apps/scanner/utils/calc-color-ratio';
import { useEffect, useRef } from '@wordpress/element';
import { __ } from '@wordpress/i18n';

export const ColorContrastForm = ({ item, current, setCurrent, setIsEdit }) => {
	const {
		isGlobal,
		setIsGlobal,
		color,
		background,
		parents,
		resolved,
		backgroundChanged,
		parentChanged,
		loading,
		changeColor,
		changeBackground,
		setParentSmaller,
		setParentLarger,
		onSubmit,
		onUpdate,
	} = useColorContrastForm({
		item,
		current,
		setCurrent,
	});

	const colorRef = useRef(null);

	useEffect(() => {
		if (item?.node) {
			colorRef.current = rgbOrRgbaToHex(
				window.getComputedStyle(item.node).getPropertyValue('color'),
			);
		}
	}, [item]);

	const isBackgroundEnabled =
		item.messageArgs[3] && item.messageArgs[4] && !item.isPotential;

	const colorData = checkContrastAA(item.node);

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

	const onGlobalChange = (value) => {
		setIsGlobal(value);
	};

	const handleUpdate = async () => {
		await onUpdate();
		setIsEdit(false);
	};

	const isSubmitDisabled =
		!colorData.passesAA ||
		resolved ||
		loading ||
		(item.isEdit &&
			color === item.messageArgs[3] &&
			background === item.messageArgs[4] &&
			!parentChanged);

	return (
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
				initialColor={colorRef.current || color}
				setColor={changeColor}
				area="color"
			/>

			{isBackgroundEnabled ? (
				<ColorSet
					title={__('Background', 'pojo-accessibility')}
					color={background}
					initialColor={item.messageArgs[4]}
					setColor={changeBackground}
					area="background"
				/>
			) : (
				<ColorSetDisabled
					title={__('Background', 'pojo-accessibility')}
					description={__(
						'Image and gradient backgrounds must be changed in the design',
						'pojo-accessibility',
					)}
				/>
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

			<Box>
				<SetGlobal
					item={item}
					onGlobalChange={onGlobalChange}
					isChecked={isGlobal}
				/>
				<Button
					variant="contained"
					size="small"
					color="info"
					loading={loading}
					disabled={isSubmitDisabled}
					onClick={item.isEdit ? handleUpdate : handleSubmit}
					sx={{ mt: 1.5 }}
					fullWidth
				>
					{isGlobal
						? __('Apply everywhere', 'pojo-accessibility')
						: __('Apply fix', 'pojo-accessibility')}
				</Button>
			</Box>
		</StyledBox>
	);
};

ColorContrastForm.propTypes = {
	item: scannerItem,
	current: PropTypes.number.isRequired,
	setCurrent: PropTypes.func.isRequired,
	setIsEdit: PropTypes.func,
};
