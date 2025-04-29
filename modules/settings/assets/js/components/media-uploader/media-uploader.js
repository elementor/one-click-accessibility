import Button from '@elementor/ui/Button';
import { MediaUpload } from '@wordpress/block-editor';
import { useState } from '@wordpress/element';
import { __ } from '@wordpress/i18n';
import MediaUploadCheck from './media-upload-check';

const MediaUploader = () => {
	const [mediaId, setMediaId] = useState(null);
	const [mediaUrl, setMediaUrl] = useState(null);

	console.log(mediaUrl);

	return (
		<MediaUploadCheck>
			<MediaUpload
				onSelect={(media) => {
					console.log('selected ' + media);
					setMediaUrl(media.url);
					setMediaId(media.id);
				}}
				value={mediaId}
				render={({ open }) => (
					<Button onClick={open}>
						{__('Add custom icon', 'pojo-accessibility')}
					</Button>
				)}
			/>
		</MediaUploadCheck>
	);
};

export default MediaUploader;
