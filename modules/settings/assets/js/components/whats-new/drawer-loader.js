import PropTypes from 'prop-types';
import ContentLoader from 'react-content-loader';
import { memo } from '@wordpress/element';
import { SKELETON_OPTIONS } from '../../constants';

const Skeleton = memo(() => {
	return (
		<ContentLoader
			speed={SKELETON_OPTIONS.SPEED}
			foregroundColor={SKELETON_OPTIONS.FOREGROUND_COLOR}
			height={708}
			width={289}
		>
			<rect x="2" y="413" width="208" height="10" fill="#D9D9D9" />
			<rect x="1" y="677" width="283" height="11" fill="#D9D9D9" />
			<rect x="1" y="697" width="235" height="11" fill="#D9D9D9" />
			<rect x="2" y="439" width="193" height="14" fill="#D9D9D9" />
			<rect x="2" y="460" width="89" height="14" fill="#D9D9D9" />
			<rect x="2" y="495" width="287" height="161" fill="#D9D9D9" />
			<rect x="1" width="208" height="10" fill="#D9D9D9" />
			<rect y="264" width="283" height="11" fill="#D9D9D9" />
			<rect y="284" width="235" height="11" fill="#D9D9D9" />
			<rect y="304" width="275" height="11" fill="#D9D9D9" />
			<rect y="324" width="275" height="11" fill="#D9D9D9" />
			<rect y="344" width="96" height="11" fill="#D9D9D9" />
			<rect y="383" width="289" height="1" fill="#D9D9D9" />
			<rect x="1" y="26" width="193" height="14" fill="#D9D9D9" />
			<rect x="1" y="47" width="89" height="14" fill="#D9D9D9" />
			<rect x="1" y="82" width="287" height="161" fill="#D9D9D9" />
		</ContentLoader>
	);
});

const DrawerLoader = memo(({ children }) => {
	return (
		<>
			<Skeleton />

			{children}
		</>
	);
});

DrawerLoader.propTypes = {
	children: PropTypes.node,
};

export default DrawerLoader;
