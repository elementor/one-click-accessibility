import InfoCircleIcon from '@elementor/icons/InfoCircleIcon';
import Chip from '@elementor/ui/Chip';
import PropTypes from 'prop-types';
import { __ } from '@wordpress/i18n';
import AIGenerateButton from './ai-generate-button';
import CardActionButtons from './card-action-buttons';
import { StyledTextField } from './styled-components';

const AltTextInput = ({
	isDecorative,
	altText,
	isLoading,
	isDraft,
	onChange,
	onGenerate,
	onSave,
	onCancel,
}) => {
	if (isDecorative) {
		return (
			<Chip
				color="success"
				label={__('No description needed', 'pojo-accessibility')}
				icon={<InfoCircleIcon />}
				variant="standard"
			/>
		);
	}

	return (
		<>
			<StyledTextField
				placeholder={__(
					'Add or generate the description here',
					'pojo-accessibility',
				)}
				aria-label={__(
					'Add or generate the description here',
					'pojo-accessibility',
				)}
				color="secondary"
				value={altText ?? ''}
				onChange={onChange}
				fullWidth
				multiline
				rows={3}
				disabled={isLoading}
				InputProps={{
					endAdornment: (
						<AIGenerateButton
							onGenerate={onGenerate}
							disabled={isLoading}
							isLoading={isLoading}
						/>
					),
				}}
			/>
			{isDraft && !isDecorative && (
				<CardActionButtons
					onSave={onSave}
					onCancel={onCancel}
					altText={altText}
				/>
			)}
		</>
	);
};

AltTextInput.propTypes = {
	isDecorative: PropTypes.bool.isRequired,
	altText: PropTypes.string,
	isLoading: PropTypes.bool,
	isDraft: PropTypes.bool.isRequired,
	onChange: PropTypes.func.isRequired,
	onGenerate: PropTypes.func.isRequired,
	onSave: PropTypes.func.isRequired,
	onCancel: PropTypes.func.isRequired,
};

export default AltTextInput;
