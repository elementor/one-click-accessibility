import SettingsIcon from '@elementor/icons/SettingsIcon';
import { StyledTitle } from '@ea11y/pages/pages.styles';
import { __ } from '@wordpress/i18n';

const ManageFixesTitle = () => {
	return (
		<>
			<SettingsIcon size="small" color="action" />

			<StyledTitle variant="subtitle1" as="h2">
				{__('Manage fixes', 'pojo-accessibility')}
			</StyledTitle>
		</>
	);
};

export default ManageFixesTitle;
