import Box from '@elementor/ui/Box';
import { styled } from '@elementor/ui/styles';

const StyledBox = styled(Box)`
	display: grid;
	justify-content: space-evenly;

	gap: ${({ theme }) => theme.spacing(5)};
	padding: ${({ theme }) => theme.spacing(2)};

	grid-template-columns: repeat(2, 1fr);
	${({ theme }) => theme.breakpoints.down('lg')} {
		grid-template-columns: repeat(1, 1fr);
	}
`;

const PositionSettingsWrapper = ({ children }) => {
	return <StyledBox>{children}</StyledBox>;
};

export default PositionSettingsWrapper;
