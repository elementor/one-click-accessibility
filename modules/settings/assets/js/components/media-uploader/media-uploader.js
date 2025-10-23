import UploadIcon from '@elementor/icons/UploadIcon';
import Button from '@elementor/ui/Button';
import { ConfirmDialog } from '@ea11y/components';
import { useIconDesign, useStorage } from '@ea11y/hooks';
import { mixpanelEvents, mixpanelService } from '@ea11y-apps/global/services';
import { useEffect, useState } from '@wordpress/element';
import { __ } from '@wordpress/i18n';
import API from '../../api';
import { usePluginSettingsContext } from '../../contexts/plugin-settings';
import MediaUploadCheck from './media-upload-check';

const MediaUploader = () => {
	const [showUnfilteredDialog, setShowUnfilteredDialog] = useState(false);
	const { iconDesign, updateIconDesign } = useIconDesign();
	const { unfilteredUploads } = usePluginSettingsContext();
	const { save } = useStorage();
	const [uploadButtonText, setUploadButtonText] = useState(
		__('Add custom icon', 'pojo-accessibility'),
	);

	useEffect(() => {
		if (iconDesign?.custom?.url) {
			setUploadButtonText(__('Change custom icon', 'pojo-accessibility'));
		}
	}, []);

	const handleSelectCustomIcon = async (mediaData) => {
		const svg = await API.getMedia(mediaData.url);

		const iconData = {
			icon: 'custom',
			custom: {
				...iconDesign.custom,
				id: mediaData.id,
				url: mediaData.url,
				mime: mediaData.mime,
				svg,
			},
		};

		updateIconDesign(iconData);

		if (iconDesign?.custom?.url) {
			mixpanelService.sendEvent(mixpanelEvents.customIconUpdated);
		} else {
			mixpanelService.sendEvent(mixpanelEvents.customIconAdded);
		}
	};

	const openCustomMediaFrame = () => {
		const frame = window.wp.media({
			title: __('Select SVG Icon', 'pojo-accessibility'),
			library: {
				type: 'image/svg+xml',
			},
			button: {
				text: __('Use this SVG', 'pojo-accessibility'),
			},
			multiple: false,
		});

		frame.on('select', async () => {
			const media = frame.state().get('selection').first().toJSON();

			// Inject your SVG handling here
			await handleSelectCustomIcon(media);
		});

		// Inject custom source info
		frame.uploader.options.uploader.params = {
			upload_source: 'ea11y-custom-icon',
		};

		frame.open();
	};

	const handleOpen = () => {
		if (iconDesign?.custom?.url) {
			mixpanelService.sendEvent(mixpanelEvents.updateCustomIconClicked);
		} else {
			mixpanelService.sendEvent(mixpanelEvents.addCustomIconClicked);
		}

		if (!unfilteredUploads) {
			setShowUnfilteredDialog(true);
			return;
		}
		openCustomMediaFrame();
	};

	return (
		<>
			<MediaUploadCheck>
				<Button color="info" onClick={handleOpen} startIcon={<UploadIcon />}>
					{uploadButtonText}
				</Button>
			</MediaUploadCheck>

			<ConfirmDialog
				open={showUnfilteredDialog}
				title={__('Allow SVG upload', 'pojo-accessibility')}
				approveText={__('Allow SVG upload', 'pojo-accessibility')}
				onApprove={async () => {
					await save({
						ea11y_unfiltered_files_upload: true,
					});
					setShowUnfilteredDialog(false);
					window.location.reload();
				}}
				onCancel={() => setShowUnfilteredDialog(false)}
			>
				{__(
					'To upload SVG files, you need to enable unfiltered uploads.',
					'pojo-accessibility',
				)}
			</ConfirmDialog>
		</>
	);
};

export default MediaUploader;
