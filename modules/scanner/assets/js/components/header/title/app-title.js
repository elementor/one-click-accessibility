import Chip from '@elementor/ui/Chip';
import { Logo } from '@ea11y-apps/scanner/images';
import { StyledTitle } from '@ea11y-apps/scanner/styles/app.styles';
import { __ } from '@wordpress/i18n';

const AppTitle = () => {
	return (
		<>
			<Logo />

			<StyledTitle variant="subtitle1" as="h2">
				{__('Accessibility Assistant', 'pojo-accessibility')}

				<Chip
					size="small"
					variant="filled"
					color="default"
					sx={{ ml: 1 }}
					label={__('Beta', 'pojo-accessibility')}
				/>
			</StyledTitle>
		</>
	);
};

export default AppTitle;
