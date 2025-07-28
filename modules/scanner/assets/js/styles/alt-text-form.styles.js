import InputLabel from '@elementor/ui/InputLabel';
import Paper from '@elementor/ui/Paper';
import { styled } from '@elementor/ui/styles';

export const StyledLabel = styled(InputLabel)`
	display: flex;
	align-items: start;
	overflow: visible;
	gap: ${({ theme }) => theme.spacing(0.5)};
`;

export const StyledPaper = styled(Paper)`
	display: flex;
	justify-content: center;
	align-items: center;
	height: 140px;
	& > * {
		max-height: 100%;
		width: auto;
	}
`;
