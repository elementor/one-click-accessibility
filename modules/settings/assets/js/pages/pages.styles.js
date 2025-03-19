import Box from '@elementor/ui/Box';
import CardContent from '@elementor/ui/CardContent';
import Container from '@elementor/ui/Container';
import Paper from '@elementor/ui/Paper';
import Typography from '@elementor/ui/Typography';
import { styled } from '@elementor/ui/styles';

export const StyledBox = styled(Box)`
	display: flex;
	flex-direction: column;
	justify-content: space-between;
	align-items: center;
	max-height: 100%;
	min-height: 50%;
`;

export const StyledContainer = styled(Container)`
	overflow: auto;
	max-height: 100%;
	padding: ${({ theme }) => theme.spacing(4)};
`;

export const StyledTitle = styled(Typography)`
	font-weight: 400;
	letter-spacing: 0.25px;
	margin-bottom: 16px;
`;

export const StyledStatementPaper = styled(Paper)`
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	padding: 24px;
	width: 376px;
	min-height: 264px;
	border-radius: ${({ theme }) => theme.shape.borderRadius};
	box-shadow: ${({ theme }) => theme.shadows[0]};
	cursor: pointer;

	:hover {
		box-shadow: 0 0 15px 0 rgba(37, 99, 235, 0.15);
		border-color: ${({ theme }) => theme.palette.info.main};
	}
`;

export const StyledStatementContainer = styled(Container)`
	overflow: auto;
	max-height: 100%;
	padding: 32px;
	display: flex;
	flex-direction: column;
	align-items: start;
	gap: 16px;
`;

export const StyledCardContent = styled(CardContent)`
	&:last-child {
		padding-bottom: 16px;
	}
`;
