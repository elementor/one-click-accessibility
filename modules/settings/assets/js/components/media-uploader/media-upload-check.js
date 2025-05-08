import CircularProgress from '@elementor/ui/CircularProgress';
import { useSelect } from '@wordpress/data';

const MediaUploadCheck = (props) => {
	const { fallback = null, children } = props;

	const { checkingPermissions, hasUploadPermissions } = useSelect((select) => {
		const core = select('core');
		return {
			hasUploadPermissions: core.canUser('read', 'media'),
			checkingPermissions: !core.hasFinishedResolution('canUser', [
				'read',
				'media',
			]),
		};
	});

	return (
		<>
			{checkingPermissions && <CircularProgress />}
			{!checkingPermissions && hasUploadPermissions ? children : fallback}
		</>
	);
};

export default MediaUploadCheck;
