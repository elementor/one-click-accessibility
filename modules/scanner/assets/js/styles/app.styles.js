import Alert from '@elementor/ui/Alert';
import Box from '@elementor/ui/Box';
import Button from '@elementor/ui/Button';
import CardContent from '@elementor/ui/CardContent';
import Paper from '@elementor/ui/Paper';
import Skeleton from '@elementor/ui/Skeleton';
import { styled } from '@elementor/ui/styles';

export const StyledPaper = styled(Paper)`
	position: relative;
	width: 425px;
	min-height: 100vh;
	height: fit-content;
`;

export const StyledContent = styled(CardContent)`
	padding: 0 ${({ theme }) => theme.spacing(1.5)};
`;

export const StyledSkeleton = styled(Skeleton)`
	transform: scale(1);
`;

const disabledState = `
		opacity: .7;
		cursor: not-allowed;
		& * {
			pointer-events: none;
		}
	`;

export const StyledAlert = styled(Alert)`
	align-items: center;
	padding-right: ${({ theme }) => theme.spacing(0.5)};
	& .MuiAlert-icon,
	& .MuiAlert-content {
		padding-top: 0;
		display: flex;
	}
	${({ disabled }) => (disabled ? disabledState : '')}
`;

export const StateContainer = styled(Box)`
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	gap: ${({ theme }) => theme.spacing(2)};
	padding-top: ${({ theme }) => theme.spacing(12)};
	padding-bottom: ${({ theme }) => theme.spacing(6)};
`;

export const StyledButtonContainer = styled(Paper)`
	display: flex;
	justify-content: space-between;
	align-items: center;
	width: 100%;
	padding: ${({ theme }) => theme.spacing(1.5)};

	&:hover {
		background-color: ${({ theme }) => theme.palette.action.hover};
	}
`;

export const StyledButton = styled(Button)`
	font-weight: 400;
	justify-content: start;
	padding: 0;
`;
