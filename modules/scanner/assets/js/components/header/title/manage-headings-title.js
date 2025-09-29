import { ThemeBuilderIcon } from '@elementor/icons';
import { StyledTitle } from '@ea11y/pages/pages.styles';
import { useHeadingStructureContext } from '@ea11y-apps/scanner/context/heading-structure-context';
import { __, sprintf } from '@wordpress/i18n';

const ManageHeadingsTitle = () => {
	const { validationStats } = useHeadingStructureContext();
	const title = validationStats.total
		? sprintf(
				// Translators: %s - headings count
				__('Manage headings (%s)', 'pojo-accessibility'),
				validationStats.total,
			)
		: __('Manage headings', 'pojo-accessibility');

	return (
		<>
			<ThemeBuilderIcon size="small" color="action" />

			<StyledTitle variant="subtitle1" as="h2">
				{title}
			</StyledTitle>
		</>
	);
};

export default ManageHeadingsTitle;
