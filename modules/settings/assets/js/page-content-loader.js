import Container from '@elementor/ui/Container';
import { styled } from '@elementor/ui/styles';
import PropTypes from 'prop-types';
import ContentLoader from 'react-content-loader';
import { memo } from '@wordpress/element';
import { SKELETON_OPTIONS } from './constants';

const StyledContainer = styled(Container)`
	overflow: auto;
	max-height: 100%;
	padding: ${({ theme }) => theme.spacing(4)};
`;

const Skeleton = memo(() => {
	return (
		<ContentLoader
			speed={SKELETON_OPTIONS.SPEED}
			foregroundColor={SKELETON_OPTIONS.FOREGROUND_COLOR}
			height={557}
			width={1040}
		>
			<path
				fill="#D9D9D9"
				d="M0 0h99v25H0zM15 81h52v19H15zM15 521h59v19H15zM15 106h494v11H15zM15 546h741v11H15zM31 160h26v9H31zM556 159h30v9h-30zM31 335h26v9H31zM31 180h107v108H31zM403 180h107v108H403zM279 180h107v108H279zM155 180h107v108H155zM31 357h148v104H31zM365 357h148v104H365zM198 357h148v104H198zM556 180h484v281H556z"
			/>
		</ContentLoader>
	);
});

const SettingsLoader = memo(({ children }) => {
	return (
		<StyledContainer>
			<Skeleton />

			{children}
		</StyledContainer>
	);
});

SettingsLoader.propTypes = {
	children: PropTypes.node,
};

export default SettingsLoader;
