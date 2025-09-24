import Chip from '@elementor/ui/Chip';
import PropTypes from 'prop-types';
import { BLOCKS } from '@ea11y-apps/scanner/constants';
import { __ } from '@wordpress/i18n';

export const ResolveChip = ({ block }) =>
	block === BLOCKS.altText ? (
		<Chip
			size="small"
			color="info"
			variant="standard"
			label={__('Resolve with Ally', 'pojo-accessibility')}
		/>
	) : (
		<Chip
			size="small"
			color="secondary"
			variant="standard"
			label={__('Resolve manually', 'pojo-accessibility')}
		/>
	);

ResolveChip.propTypes = {
	block: PropTypes.string.isRequired,
};
