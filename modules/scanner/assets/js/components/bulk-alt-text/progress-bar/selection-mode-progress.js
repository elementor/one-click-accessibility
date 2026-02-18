import Button from '@elementor/ui/Button';
import Typography from '@elementor/ui/Typography';
import PropTypes from 'prop-types';
import PencilTickIcon from '@ea11y-apps/scanner/icons/pencil-tick-icon';
import { __, sprintf } from '@wordpress/i18n';
import GenerateAllButton from './generate-all-button';
import { StyledMainWrapperGrid, StyledActionsGrid } from './styled-components';

const SelectionModeProgress = ({
	manuallySelectedCount,
	isGenerating,
	onClear,
	onMarkAsDecorative,
	onGenerate,
}) => {
	return (
		<StyledMainWrapperGrid
			container
			bgcolor="#E0E0E0"
			justifyContent="space-between"
		>
			<StyledActionsGrid>
				<Typography variant="h6" as="h2" color="text.secondary">
					{sprintf(
						// Translators: %d number of selected images
						__('%d selected', 'pojo-accessibility'),
						manuallySelectedCount,
					)}
				</Typography>
				<Button color="secondary" variant="text" size="small" onClick={onClear}>
					{__('Clear', 'pojo-accessibility')}
				</Button>
			</StyledActionsGrid>
			<StyledActionsGrid>
				<Button
					color="secondary"
					variant="outlined"
					startIcon={<PencilTickIcon />}
					onClick={onMarkAsDecorative}
				>
					{__('Mark as decorative', 'pojo-accessibility')}
				</Button>
				<GenerateAllButton
					onClick={onGenerate}
					disabled={isGenerating}
					text={__('Generate', 'pojo-accessibility')}
				/>
			</StyledActionsGrid>
		</StyledMainWrapperGrid>
	);
};

SelectionModeProgress.propTypes = {
	manuallySelectedCount: PropTypes.number.isRequired,
	isGenerating: PropTypes.bool.isRequired,
	onClear: PropTypes.func.isRequired,
	onMarkAsDecorative: PropTypes.func.isRequired,
	onGenerate: PropTypes.func.isRequired,
};

export default SelectionModeProgress;
