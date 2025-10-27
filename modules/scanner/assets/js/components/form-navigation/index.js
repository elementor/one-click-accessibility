import Box from '@elementor/ui/Box';
import Divider from '@elementor/ui/Divider';
import Pagination from '@elementor/ui/Pagination';
import { styled } from '@elementor/ui/styles';
import PropTypes from 'prop-types';

export const FormNavigation = ({ total, current, setCurrent }) => {
	const onChange = (event, index) => setCurrent(index - 1);
	return (
		<Navigation>
			<Divider />
			<StyledBox>
				<StyledNavigation>
					<Pagination count={total} page={current + 1} onChange={onChange} />
				</StyledNavigation>
			</StyledBox>
		</Navigation>
	);
};

const Navigation = styled(Box)`
	position: absolute;
	bottom: 0;
	left: 0;
	width: 100%;
`;
const StyledBox = styled(Box)`
	display: flex;
	justify-content: center;
	padding-block: ${({ theme }) => theme.spacing(2)};
`;

const StyledNavigation = styled(Box)`
	display: flex;
	justify-content: space-between;
	align-items: center;
	gap: ${({ theme }) => theme.spacing(2)};
`;

FormNavigation.propTypes = {
	total: PropTypes.number.isRequired,
	current: PropTypes.number.isRequired,
	setCurrent: PropTypes.func.isRequired,
};
