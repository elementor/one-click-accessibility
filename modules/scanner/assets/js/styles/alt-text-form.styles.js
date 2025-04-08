import Alert from '@elementor/ui/Alert';
import Box from '@elementor/ui/Box';
import InputLabel from '@elementor/ui/InputLabel';
import Paper from '@elementor/ui/Paper';
import { styled } from '@elementor/ui/styles';

export const StyledBox = styled(Box)`
	display: flex;
	flex-direction: column;
	gap: ${({ theme }) => theme.spacing(2)};
`;

export const StyledLabel = styled(InputLabel)`
	display: flex;
	align-items: start;
	overflow: visible;
	gap: ${({ theme }) => theme.spacing(0.5)};
	padding-top: ${({ theme }) => theme.spacing(1)};
`;

export const StyledAlert = styled(Alert)`
	align-items: center;
	& .MuiAlert-icon,
	& .MuiAlert-content {
		padding-top: 0;
	}
`;

export const StyledPaper = styled(Paper)`
	display: flex;
	justify-content: center;
	align-items: center;
	height: 140px;
`;
