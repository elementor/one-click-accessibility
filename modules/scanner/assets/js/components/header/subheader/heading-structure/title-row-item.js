import PropTypes from 'prop-types';
import { injectTemplateVars } from '@ea11y-apps/global/utils/inject-template-vars';
import {
	StyledTitleRowItem,
	StyledTitleRowItemTypography,
} from '@ea11y-apps/scanner/styles/heading-structure.styles';

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
