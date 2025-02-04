import { EditIcon } from '@elementor/icons';
import IconButton from '@elementor/ui/IconButton';
import Tooltip from '@elementor/ui/Tooltip';
import { useSettings } from '@ea11y/hooks';
import { __ } from '@wordpress/i18n';

const EditLink = () => {
	const { accessibilityStatementData } = useSettings();
	const handleEdit = () => {
		window.open(
			`/wp-admin/post.php?post=${accessibilityStatementData?.pageId}&action=edit`,
			'_blank',
		);
	};
	return (
		<Tooltip
			placement="top"
			title={__('Edit page', 'pojo-accessibility')}
			arrow={true}
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
			<IconButton onClick={handleEdit} sx={{ marginLeft: 1 }}>
				<EditIcon />
			</IconButton>
		</Tooltip>
	);
};

export default EditLink;
