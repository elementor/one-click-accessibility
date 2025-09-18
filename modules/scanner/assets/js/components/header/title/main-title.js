import Chip from '@elementor/ui/Chip';
import { StyledTitle } from '@ea11y/pages/pages.styles';
import { Logo } from '@ea11y-apps/scanner/images';
import { __ } from '@wordpress/i18n';

const MainTitle = () => {
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

export default MainTitle;
