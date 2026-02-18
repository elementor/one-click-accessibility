import CardContent from '@elementor/ui/CardContent';
import Grid from '@elementor/ui/Grid';
import PropTypes from 'prop-types';
import { ImagePreview } from '@ea11y-apps/scanner/components/alt-text-form/image-preview';
import { useAltTextForm } from '@ea11y-apps/scanner/hooks/use-alt-text-form';
import { speak } from '@wordpress/a11y';
import { memo } from '@wordpress/element';
import { __ } from '@wordpress/i18n';
import AltTextInput from './alt-text-input';
import CardSelectionIndicator from './card-selection-indicator';
import DecorativeCheckbox from './decorative-checkbox';
import { StyledCard, PreviewWrapper } from './styled-components';

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

	return (
		<StyledCard
			elevation={0}
			variant="outlined"
			isLoading={isLoading}
			isCurrentlySelected={data?.[current]?.selected}
			hasValidAltText={data?.[current]?.hasValidAltText}
			isDraft={data?.[current]?.isDraft}
			isDecorative={data?.[current]?.makeDecorative}
		>
			<CardContent
				sx={{
					padding: 0,
					display: 'flex',
					flexDirection: 'column',
					height: '100%',
				}}
			>
				<Grid container padding={2} justifyContent="center" bgcolor="#EBEBEB">
					<CardSelectionIndicator
						isLoading={isLoading}
						isSelected={data?.[current]?.selected ?? false}
						hasValidAltText={data?.[current]?.hasValidAltText}
						onRadioClick={handleRadioClick}
					/>
					<PreviewWrapper>
						<ImagePreview element={item.node} />
					</PreviewWrapper>
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
