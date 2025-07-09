import Box from '@elementor/ui/Box';
import ContentLoader from 'react-content-loader';
import { memo } from '@wordpress/element';
import { SKELETON_OPTIONS } from '../../../constants';

const Skeleton = memo(() => {
	return (
		<ContentLoader
			speed={SKELETON_OPTIONS.SPEED}
			foregroundColor={SKELETON_OPTIONS.FOREGROUND_COLOR}
			height={104}
			width={104}
		>
			<circle cx="52" cy="52" r="52" fill="none" />
		</ContentLoader>
	);
});

const PieChartLoader = memo(() => {
	return (
		<Box>
			<Skeleton />
		</Box>
	);
});

export default PieChartLoader;
