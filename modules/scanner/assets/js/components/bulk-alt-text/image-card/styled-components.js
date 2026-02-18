import Card from '@elementor/ui/Card';
import Grid from '@elementor/ui/Grid';
import TextField from '@elementor/ui/TextField';
import { styled } from '@elementor/ui/styles';

export const StyledCard = styled(Card, {
	shouldForwardProp: (prop) =>
		prop !== 'isLoading' &&
		prop !== 'isCurrentlySelected' &&
		prop !== 'hasValidAltText' &&
		prop !== 'isDraft' &&
		prop !== 'isDecorative',
})`
	border-radius: ${({ theme }) => theme.shape.borderRadius * 2}px;
	height: 282px;
	width: 248px;

	& .MuiCardContent-root:last-child {
		padding-bottom: 0;
	}

	${({ theme, isLoading, isCurrentlySelected, hasValidAltText, isDraft }) =>
		(isLoading || (isCurrentlySelected && !hasValidAltText)) && !isDraft
			? `border: 2px solid; border-color: ${theme.palette.info.main};`
			: ''}
`;

export const StyledPreviewWrapper = styled(Grid)`
	display: flex;
	justify-content: center;
	align-items: center;

	& .MuiPaper-root {
		background-color: transparent;
		width: 130px;
		height: 96px;
	}

	& img {
		width: 130px;
		height: 96px;
		font-size: auto;
		object-fit: cover;
		border-radius: ${({ theme }) => theme.shape.borderRadius * 2}px;
	}
`;

export const StyledTextField = styled(TextField)`
	& .MuiInputBase-root {
		padding: 0;
		font-size: 14px;
	}

	& .MuiInputBase-input {
		padding: ${({ theme }) =>
			`${theme.spacing(1)} ${theme.spacing(1.5)} ${theme.spacing(1)} ${theme.spacing(1)}`};
	}

	& fieldset {
		border-color: transparent;
		overflow: auto;

		&:selected {
			border: auto;
		}
	}
`;
