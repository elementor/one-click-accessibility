import PropTypes from 'prop-types';
import {
	StyledTitleRowItem,
	StyledTitleRowItemTypography,
} from '@ea11y-apps/scanner/styles/heading-structure.styles';
import { injectTemplateVars } from '../../../../../../../settings/assets/js/utils';

const HeadingStructureTitleRowItem = ({ icon, text }) => {
	return (
		<StyledTitleRowItem>
			{icon}

			<StyledTitleRowItemTypography variant="body2" as="span">
				{injectTemplateVars(text, { b: ({ children }) => <b>{children}</b> })}
			</StyledTitleRowItemTypography>
		</StyledTitleRowItem>
	);
};

HeadingStructureTitleRowItem.propTypes = {
	icon: PropTypes.node.isRequired,
	text: PropTypes.string.isRequired,
};

export default HeadingStructureTitleRowItem;
