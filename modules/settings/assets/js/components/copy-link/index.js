import { LinkIcon } from '@elementor/icons';
import IconButton from '@elementor/ui/IconButton';
import Tooltip from '@elementor/ui/Tooltip';
import clipboardCopy from 'clipboard-copy';
import { useState } from '@wordpress/element';
import { __ } from '@wordpress/i18n';

const CopyLink = ({ content }) => {
	const [open, setOpen] = useState(false);
	const [copied, setCopied] = useState(false);

	const handleClose = () => {
		setOpen(false);
		setTimeout(() => setCopied(false), 200); // add delay for animation
	};

	const handleOpen = () => {
		setOpen(true);
	};

	const copyToClipboard = async () => {
		await clipboardCopy(content);
		setCopied(true);
	};

	return (
		<Tooltip
			open={open}
			onClose={handleClose}
			onOpen={handleOpen}
			title={copied ? __('Copied!', 'site-mailer') : __('Copy', 'site-mailer')}
			arrow={false}
			PopperProps={{
				modifiers: [
					{
						name: 'offset',
						options: {
							offset: [0, -8], // Adjusts the vertical (top) margin
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
				onClick={copyToClipboard}
				sx={{ width: '50px', height: '50px', marginLeft: 2 }}
			>
				<LinkIcon width="1em" height="1em" />
			</IconButton>
		</Tooltip>
	);
};

export default CopyLink;
