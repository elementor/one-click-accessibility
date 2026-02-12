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
})(({ theme, isLoading, isCurrentlySelected, hasValidAltText, isDraft }) => ({
	borderRadius: theme.shape.borderRadius * 2,
	height: 280,
	'& .MuiCardContent-root:last-child': {
		paddingBottom: 0,
	},
	...((isLoading || (isCurrentlySelected && !hasValidAltText)) &&
		!isDraft && {
			border: '2px solid',
			borderColor: theme.palette.info.main,
		}),
}));

export const PreviewWrapper = styled(Grid)(() => ({
	display: 'flex',
	justifyContent: 'center',
	alignItems: 'center',

	'& .MuiPaper-root': {
		backgroundColor: 'transparent',
		width: 130,
		height: 96,
	},

	'& img': {
		width: 130,
		height: 96,
		fontSize: 'auto',
		objectFit: 'cover',
		borderRadius: 8,
	},
}));

export const StyledTextField = styled(TextField)(() => ({
	'& .MuiInputBase-root': {
		padding: '0',
		fontSize: 14,
	},
	'& .MuiInputBase-input': {
		padding: '8px 12px 8px 8px',
	},
	'& fieldset': {
		borderColor: 'transparent',
		overflow: 'auto',

		'&:selected': {
			border: 'auto',
		},
	},
}));
