import PropTypes from 'prop-types';
import { StyledTreeList } from '@ea11y-apps/scanner/styles/heading-structure.styles';

const HeadingStructureHeadingTreeList = ({ children }) => {
	return <StyledTreeList>{children}</StyledTreeList>;
};

HeadingStructureHeadingTreeList.propTypes = {
	children: PropTypes.node.isRequired,
};

export default HeadingStructureHeadingTreeList;
