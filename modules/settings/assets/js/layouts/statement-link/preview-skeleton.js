import Box from '@elementor/ui/Box';
import { styled } from '@elementor/ui/styles';
import PropTypes from 'prop-types';
import ContentLoader from 'react-content-loader';
import { memo } from '@wordpress/element';
import { SKELETON_OPTIONS } from '../../constants';

const StyledContainer = styled(Box)`
	padding: 0;

	justify-content: center;
	display: flex;
`;

const Skeleton = memo(() => {
	return (
		<ContentLoader
			speed={SKELETON_OPTIONS.SPEED}
			foregroundColor={SKELETON_OPTIONS.FOREGROUND_COLOR}
			height={249}
			width={537}
		>
			<rect x="25" y="221" width="191" height="15" fill="#D9D9D9" />
			<rect x="444" y="222" width="42" height="15" fill="#D9D9D9" />
			<rect x="492" y="219" width="20" height="20" rx="10" fill="#D9D9D9" />
			<rect x="25" y="26" width="152" height="110" rx="10" fill="#D9D9D9" />
			<path
				d="M25 0H177V0C177 5.52285 172.523 10 167 10H35C29.4772 10 25 5.52285 25 0V0Z"
				fill="#D9D9D9"
			/>
			<path
				d="M193 0H345V0C345 5.52285 340.523 10 335 10H203C197.477 10 193 5.52285 193 0V0Z"
				fill="#D9D9D9"
			/>
			<path
				d="M362 0H514V0C514 5.52285 509.523 10 504 10H372C366.477 10 362 5.52285 362 0V0Z"
				fill="#D9D9D9"
			/>
			<rect x="193" y="26" width="152" height="110" rx="10" fill="#D9D9D9" />
			<rect x="362" y="26" width="152" height="110" rx="10" fill="#D9D9D9" />
			<path
				d="M25 162C25 156.477 29.4772 152 35 152H167C172.523 152 177 156.477 177 162V209H25V162Z"
				fill="#D9D9D9"
			/>
			<line y1="208.5" x2="536.903" y2="208.5" stroke="#D9D9D9" />
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
