import CardContent from '@elementor/ui/CardContent';
import Grid from '@elementor/ui/Grid';
import PropTypes from 'prop-types';
import { ImagePreview } from '@ea11y-apps/scanner/components/alt-text-form/image-preview';
import { useAltTextForm } from '@ea11y-apps/scanner/hooks/use-alt-text-form';
import { speak } from '@wordpress/a11y';
import { memo } from '@wordpress/element';
import { __, sprintf } from '@wordpress/i18n';
import AltTextInput from './alt-text-input';
import CardSelectionIndicator from './card-selection-indicator';
import DecorativeCheckbox from './decorative-checkbox';
import { StyledCard, StyledPreviewWrapper } from './styled-components';

const getImageLabel = (node) => {
	if (!node) {
		return __('Image', 'pojo-accessibility');
	}
	if (node.src) {
		try {
			const pathname = new URL(node.src).pathname;
			const encodedFilename = pathname.split('/').pop();
			if (!encodedFilename) {
				return __('Image', 'pojo-accessibility');
			}
			try {
				return decodeURIComponent(encodedFilename);
			} catch {
				return encodedFilename;
			}
		} catch {
			return __('Image', 'pojo-accessibility');
		}
	}
	return __('Image', 'pojo-accessibility');
};

const ImageCard = ({ item, current }) => {
	const {
		data,
		loadingAiText,
		handleChange,
		handleCheck,
		handleSave,
		handleCancel,
		generateAltText,
		updateData,
	} = useAltTextForm({
		current,
		item,
	});

	const handleRadioClick = () => {
		const hasValidAltText = data?.[current]?.hasValidAltText;
		const isCurrentlySelected = data?.[current]?.selected;

		if (isCurrentlySelected && hasValidAltText) {
			return;
		}

		const willBeSelected = !isCurrentlySelected;
		updateData({
			selected: willBeSelected,
		});

		const message = willBeSelected
			? __('Image selected', 'pojo-accessibility')
			: __('Image deselected', 'pojo-accessibility');
		speak(message, 'polite');
	};

	const isLoading = loadingAiText || data?.[current]?.isGenerating;
	const imageLabel = getImageLabel(item?.node);
	const cardLabel = sprintf(
		/* translators: %s: image file name or "Image" */
		__('Alt text card for %s', 'pojo-accessibility'),
		imageLabel,
	);

	return (
		<StyledCard
			elevation={0}
			variant="outlined"
			isLoading={isLoading}
			isCurrentlySelected={data?.[current]?.selected}
			hasValidAltText={data?.[current]?.hasValidAltText}
			isDraft={data?.[current]?.isDraft}
			isDecorative={data?.[current]?.makeDecorative}
			tabIndex={0}
			role="group"
			aria-label={cardLabel}
		>
			<CardContent
				sx={{
					padding: 0,
					display: 'flex',
					flexDirection: 'column',
					height: '100%',
				}}
			>
				<Grid container padding={2.5} justifyContent="center" bgcolor="#EBEBEB">
					<CardSelectionIndicator
						imageLabel={getImageLabel(item?.node)}
						isLoading={isLoading}
						isSelected={data?.[current]?.selected ?? false}
						hasValidAltText={data?.[current]?.hasValidAltText}
						onRadioClick={handleRadioClick}
					/>
					<StyledPreviewWrapper>
						<ImagePreview element={item.node} />
					</StyledPreviewWrapper>
				</Grid>
				<Grid
					padding={1.5}
					sx={{ display: 'flex', flexDirection: 'column', flex: 1 }}
				>
					<AltTextInput
						isDecorative={data?.[current]?.makeDecorative ?? false}
						altText={data?.[current]?.altText}
						isLoading={isLoading}
						isDraft={data?.[current]?.isDraft ?? false}
						onChange={handleChange}
						onGenerate={generateAltText}
						onSave={handleSave}
						onCancel={handleCancel}
					/>
				</Grid>
				{!data?.[current]?.isDraft && (
					<DecorativeCheckbox
						checked={data?.[current]?.makeDecorative ?? false}
						onChange={handleCheck}
					/>
				)}
			</CardContent>
		</StyledCard>
	);
};

ImageCard.propTypes = {
	item: PropTypes.object.isRequired,
	current: PropTypes.number.isRequired,
};

export default memo(ImageCard);
