import Box from '@elementor/ui/Box';
import ContentLoader from 'react-content-loader';
import { memo } from '@wordpress/element';
import { SKELETON_OPTIONS } from '../../../constants';

const Skeleton = memo(() => {
	return (
		<ContentLoader
			speed={SKELETON_OPTIONS.SPEED}
			foregroundColor={SKELETON_OPTIONS.FOREGROUND_COLOR}
			height={40}
			width={72}
		>
			<rect width="72" height="40" fill="none" rx="4" />
		</ContentLoader>
	);
});

const ValueLoader = memo(() => {
	return (
		<Box>
			<Skeleton />
		</Box>
	);
});

export default ValueLoader;
