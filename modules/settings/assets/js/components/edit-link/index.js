import EditIcon from '@elementor/icons/EditIcon';
import IconButton from '@elementor/ui/IconButton';
import Tooltip from '@elementor/ui/Tooltip';
import { useSettings } from '@ea11y/hooks';
import { __ } from '@wordpress/i18n';
import { addQueryArgs } from '@wordpress/url';
import { openLink } from '../../utils';

const EditLink = () => {
	const { accessibilityStatementData } = useSettings();
	const handleEdit = () => {
		const adminUrl = window?.ea11ySettingsData?.adminUrl;
		const url = addQueryArgs(`${adminUrl}post.php`, {
			post: accessibilityStatementData?.pageId,
			action: 'edit',
		});
		openLink(url);
	};

	return (
		<Tooltip
			placement="top"
			title={__('Edit page', 'pojo-accessibility')}
			arrow
			PopperProps={{
				modifiers: [
					{
						name: 'offset',
						options: {
							offset: [0, -16], // Adjusts the vertical (top) margin
						},
					},
					{
						name: 'zIndex',
						enabled: true,
						phase: 'beforeWrite',
						fn: ({ state }) => {
							state.styles.popper.zIndex = '99999'; // Apply zIndex to the Popper element
						},
					},
				],
			}}
		>
			<IconButton
				onClick={handleEdit}
				sx={{ marginLeft: 1 }}
				aria-label="Edit accessibility statement page"
			>
				<EditIcon />
			</IconButton>
		</Tooltip>
	);
};

export default EditLink;
