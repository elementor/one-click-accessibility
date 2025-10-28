import Box from '@elementor/ui/Box';
import Divider from '@elementor/ui/Divider';
import Pagination from '@elementor/ui/Pagination';
import { styled } from '@elementor/ui/styles';
import PropTypes from 'prop-types';

export const FormNavigation = ({ total, current, setCurrent }) => {
	const onChange = (event, index) => setCurrent(index - 1);
	return (
		<Box sx={{ minHeight: '65px' }}>
			<Navigation>
				<Divider />
				<StyledBox>
					<StyledNavigation>
						<Pagination count={total} page={current + 1} onChange={onChange} />
					</StyledNavigation>
				</StyledBox>
			</Navigation>
		</Box>
	);
};

const Navigation = styled(Box)`
	position: fixed;
	bottom: 0;
	right: 16px;
	width: 393px;
	background: ${({ theme }) => theme.palette.background.paper};
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
