import Container from '@elementor/ui/Container';
import { styled } from '@elementor/ui/styles';
import PropTypes from 'prop-types';
import ContentLoader from 'react-content-loader';
import { memo } from '@wordpress/element';
import { SKELETON_OPTIONS } from '../../constants';

const StyledContainer = styled(Container)`
	justify-content: center;
	display: flex;
`;

const Skeleton = memo(() => {
	return (
		<ContentLoader
			speed={SKELETON_OPTIONS.SPEED}
			foregroundColor={SKELETON_OPTIONS.FOREGROUND_COLOR}
			height={497}
			width={393}
		>
			<rect x="19" y="18" width="99.6184" height="16.2418" fill="#D9D9D9" />
			<rect
				x="292"
				y="10"
				width="32.8412"
				height="32.4837"
				rx="16.2418"
				fill="#D9D9D9"
			/>
			<rect
				x="244"
				y="10"
				width="32.8412"
				height="32.4837"
				rx="16.2418"
				fill="#D9D9D9"
			/>
			<rect
				x="340"
				y="10"
				width="32.8412"
				height="32.4837"
				rx="16.2418"
				fill="#D9D9D9"
			/>
			<rect x="17" y="476" width="134" height="14" fill="#D9D9D9" />
			<rect x="324" y="476" width="31" height="14" fill="#D9D9D9" />
			<rect
				x="360"
				y="476"
				width="14.2312"
				height="14.0763"
				rx="7.03813"
				fill="#D9D9D9"
			/>
			<rect
				x="17"
				y="76"
				width="109.471"
				height="73.6296"
				rx="4"
				fill="#D9D9D9"
			/>
			<rect
				x="17"
				y="164"
				width="109.471"
				height="73.6296"
				rx="4"
				fill="#D9D9D9"
			/>
			<rect
				x="141"
				y="164"
				width="109.471"
				height="73.6296"
				rx="4"
				fill="#D9D9D9"
			/>
			<rect
				x="265"
				y="164"
				width="109.471"
				height="73.6296"
				rx="4"
				fill="#D9D9D9"
			/>
			<rect
				x="17"
				y="252"
				width="109.471"
				height="73.6296"
				rx="4"
				fill="#D9D9D9"
			/>
			<rect
				x="141"
				y="252"
				width="109.471"
				height="73.6296"
				rx="4"
				fill="#D9D9D9"
			/>
			<rect
				x="265"
				y="252"
				width="109.471"
				height="73.6296"
				rx="4"
				fill="#D9D9D9"
			/>
			<rect
				x="17"
				y="340"
				width="109.471"
				height="73.6296"
				rx="4"
				fill="#D9D9D9"
			/>
			<rect
				x="141"
				y="340"
				width="109.471"
				height="73.6296"
				rx="4"
				fill="#D9D9D9"
			/>
			<rect
				x="264"
				y="340"
				width="109.471"
				height="73.6296"
				rx="4"
				fill="#D9D9D9"
			/>
			<rect x="17" y="428" width="109" height="42" rx="4" fill="#D9D9D9" />
			<rect
				x="141"
				y="76"
				width="109.471"
				height="73.6296"
				rx="4"
				fill="#D9D9D9"
			/>
			<rect
				x="265"
				y="76"
				width="109.471"
				height="73.6296"
				rx="4"
				fill="#D9D9D9"
			/>
			<line y1="56.5" x2="393" y2="56.5" stroke="#D9D9D9" />
			<line y1="469.5" x2="393" y2="469.5" stroke="#D9D9D9" />
		</ContentLoader>
	);
});

const WidgetPreviewSkeleton = memo(({ children }) => {
	return (
		<StyledContainer>
			<Skeleton />

			{children}
		</StyledContainer>
	);
});

WidgetPreviewSkeleton.propTypes = {
	children: PropTypes.node,
};

export default WidgetPreviewSkeleton;
