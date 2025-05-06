import { useBlockProps } from '@wordpress/block-editor';
import { registerBlockType } from '@wordpress/blocks';
import { TextControl } from '@wordpress/components';
import { __ } from '@wordpress/i18n';

const Edit = ({ attributes, setAttributes }) => {
	const blockProps = useBlockProps();
	return (
		<div {...blockProps}>
			<TextControl
				label={__('Link Text', 'pojo-accessibility')}
				value={attributes.linkText}
				onChange={(value) => setAttributes({ linkText: value })}
			/>
		</div>
	);
};

const Save = ({ attributes }) => {
	const blockProps = useBlockProps.save();
	return (
		<div {...blockProps}>
			{/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
			<a className="ally-widget-trigger" href="#">
				{attributes.linkText}
			</a>
		</div>
	);
};

registerBlockType('ally/custom-link', {
	title: __('Ally Widget Trigger', 'pojo-accessibility'),
	icon: 'admin-links',
	category: 'widgets',
	attributes: {
		linkText: {
			type: 'string',
			default: __('Open Ally Widget', 'pojo-accessibility'),
		},
	},

	edit: Edit,

	save: Save,
});
