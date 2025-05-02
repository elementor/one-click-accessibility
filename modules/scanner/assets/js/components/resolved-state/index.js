import Box from '@elementor/ui/Box';
import Typography from '@elementor/ui/Typography';
import PropTypes from 'prop-types';
import { ResolvedImage } from '@ea11y-apps/scanner/images';
import { StateContainer } from '@ea11y-apps/scanner/styles/app.styles';
import { __ } from '@wordpress/i18n';

export const ResolvedState = ({ isMain }) => (
	<StateContainer>
		<ResolvedImage />
		<Box sx={{ maxWidth: '250px' }}>
			{isMain ? (
				<>
					<Typography variant="body1" align="center">
						{__('All done!', 'pojo-accessibility')}
					</Typography>
					<Typography variant="body1" align="center">
						{__('There are no issues to resolve.', 'pojo-accessibility')}
					</Typography>
				</>
			) : (
				<>
					<Typography variant="body1" align="center">
						{__('All clear!', 'pojo-accessibility')}
					</Typography>
					<Typography variant="body1" align="center">
						{__(
							'Your scan is complete and there are no active issues to resolve',
							'pojo-accessibility',
						)}
					</Typography>
				</>
			)}
		</Box>
	</StateContainer>
);

ResolvedState.propTypes = {
	isMain: PropTypes.bool,
};
