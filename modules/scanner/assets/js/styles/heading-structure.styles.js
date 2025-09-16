import Alert from '@elementor/ui/Alert';
import Box from '@elementor/ui/Box';
import Button from '@elementor/ui/Button';
import FormControlLabel from '@elementor/ui/FormControlLabel';
import Select from '@elementor/ui/Select';
import Stack from '@elementor/ui/Stack';
import Typography from '@elementor/ui/Typography';
import { styled } from '@elementor/ui/styles';
import { STATUS_CONFIG } from '@ea11y-apps/scanner/components/heading-structure/constants';

export const StyledDescription = styled(Typography)`
	color: ${({ theme }) => theme.palette.text.secondary};
	font-size: 14px;
	line-height: 143%;
	letter-spacing: 0.15px;

	&:first-of-type {
		margin-top: ${({ theme }) => theme.spacing(2)};
		margin-bottom: ${({ theme }) => theme.spacing(1)};
	}

	&:last-of-type {
		margin: 0;

		font-size: 13px;
	}

	span {
		font-weight: 600;
	}
`;

export const StyledTitleRowContainer = styled(Stack)`
	display: flex;
	align-items: center;

	padding: ${({ theme }) => theme.spacing(1.5)};

	box-shadow: 0 1px 5px 0 ${({ theme }) => theme.palette.divider};
	background-color: ${({ theme }) => theme.palette.background.default};
`;

export const StyledTitleRowItem = styled(Box)`
	display: flex;
	align-items: center;
`;

export const StyledTitleRowItemTypography = styled(Typography)`
	margin-inline-start: ${({ theme }) => theme.spacing(0.5)};

	color: ${({ theme }) => theme.palette.text.secondary};
	font-size: 14px;
	font-weight: 400;
	line-height: 18px;
	letter-spacing: 0.15px;

	b {
		font-weight: 600;
	}
`;

export const StyledTreeList = styled('ul')`
	padding: 0;

	li {
		list-style-type: none;
	}
`;

export const StyledTreeListItem = styled('li', {
	shouldForwardProp: (prop) => prop !== 'isExpanded',
})`
	box-sizing: border-box;

	display: flex;
	flex-direction: column;
	justify-content: center;
	align-items: flex-start;

	margin-bottom: ${({ theme }) => theme.spacing(1.25)};
	box-shadow: ${({ isExpanded, theme }) =>
		isExpanded
			? `0 0 0 2px ${theme.palette.action.active}`
			: `0 0 0 1px ${theme.palette.divider}`};

	border-radius: ${({ theme }) => theme.shape.borderRadius}px;
	user-select: none;
	transition: 300ms ease-in-out;

	&:hover {
		box-shadow: ${({ isExpanded, theme }) =>
			isExpanded
				? `0 0 0 2px ${theme.palette.action.active}`
				: `0 0 0 1px ${theme.palette.text.primary}`};

		transition: 300ms ease-in-out;
	}

	& * {
		box-sizing: border-box;
	}
`;

export const StyledListItemTopWrapper = styled(Button, {
	shouldForwardProp: (prop) => !['isExpanded', 'level'].includes(prop),
})`
	width: 100%;

	display: flex;
	justify-content: flex-start;
	align-items: center;

	padding: ${({ theme }) => theme.spacing(1)};
	padding-inline-start: calc(
		(12px * ${({ level }) => level - 1}) + ${({ theme }) => theme.spacing(1)}
	);
	transition: 300ms ease-in-out;
	cursor: pointer;

	&:hover {
		background-color: ${({ isExpanded, theme }) =>
			isExpanded ? 'initial' : theme.palette.action.hover};
		transition: 300ms ease-in-out;
	}

	.MuiSvgIcon-root {
		margin-inline-start: auto;
	}
`;

export const StyledListItemDetails = styled(Box)`
	width: 100%;
	max-height: 500px;

	padding: ${({ theme }) => theme.spacing(1)};
	padding-top: 0;
`;

export const StyledListItemLevelBox = styled(Box, {
	shouldForwardProp: (prop) => prop !== 'status',
})`
	width: 32px;
	height: 32px;

	padding: ${({ theme }) => `${theme.spacing(0.5)} ${theme.spacing(0.75)}`};
	margin-inline-end: ${({ theme }) => theme.spacing(1)};

	border: 1px solid ${({ status }) => STATUS_CONFIG[status].borderColor};
	background: #f3f3f4;
	border-radius: ${({ theme }) => theme.shape.borderRadius}px;

	span {
		color: ${({ status }) => STATUS_CONFIG[status].textColor};
	}
`;

export const StyledListItemContent = styled(Typography, {
	shouldForwardProp: (prop) => prop !== 'level',
})`
	max-width: calc(268px - (12px * ${({ level }) => level - 1}));

	color: ${({ theme }) => theme.palette.text.primary};
	font-size: 14px;
	font-style: normal;
	font-weight: 400;
	line-height: 20px;
	letter-spacing: 0.15px;
	overflow: hidden;
	text-overflow: ellipsis;
	white-space: nowrap;
`;

export const StyledListItemAlert = styled(Alert)`
	margin-top: ${({ theme }) => theme.spacing(1.5)};
	padding: ${({ theme }) => `${theme.spacing(1)} ${theme.spacing(1.5)}`};
`;

export const StyledListItemBottomWrapper = styled(Box)`
	width: 100%;

	margin-top: ${({ theme }) => theme.spacing(2)};
`;

export const StyledListItemSelect = styled(Select)`
	.MuiSelect-select {
		.MuiTypography-root b {
			font-weight: 400;
		}
	}
`;

export const StyledListItemActionsWrapper = styled(Box)`
	width: 100%;

	display: flex;
	align-items: center;

	margin-top: ${({ theme }) => theme.spacing(2)};

	.MuiButton-text {
		margin-inline-start: auto;
		margin-inline-end: ${({ theme }) => theme.spacing(1)};
	}
`;

export const StyledListItemDismissLabel = styled(FormControlLabel)`
	margin-left: -7px;

	.MuiTypography-root {
		font-size: 14px;
	}
`;
