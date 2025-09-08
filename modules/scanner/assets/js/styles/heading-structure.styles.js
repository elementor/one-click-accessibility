import Alert from '@elementor/ui/Alert';
import Box from '@elementor/ui/Box';
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
	display: flex;
	flex-direction: column;
	justify-content: center;
	align-items: flex-start;

	padding: ${({ theme }) => `${theme.spacing(1.25)} ${theme.spacing(1)}`};
	margin-bottom: ${({ theme }) => theme.spacing(1.25)};
	border: ${({ isExpanded, theme }) =>
		isExpanded
			? `2px solid ${theme.palette.action.active}`
			: `1px solid ${theme.palette.divider}`};

	border-radius: ${({ theme }) => theme.shape.borderRadius}px;
	cursor: pointer;
	user-select: none;
`;

export const StyledListItemTopWrapper = styled(Box, {
	shouldForwardProp: (prop) => prop !== 'level',
})`
	box-sizing: border-box;

	width: 100%;

	display: flex;
	justify-content: flex-start;
	align-items: center;

	padding-inline-start: calc(12px * ${({ level }) => level - 1});

	.MuiSvgIcon-root {
		margin-inline-start: auto;
	}
`;

export const StyledListItemDetails = styled(Box, {
	shouldForwardProp: (prop) => prop !== 'isExpanded',
})`
	width: 100%;
	max-height: ${({ isExpanded }) => (isExpanded ? '500px' : '0')};

	transition: 300ms ease-in-out;
	opacity: ${({ isExpanded }) => (isExpanded ? '1' : '0')};
	visibility: ${({ isExpanded }) => (isExpanded ? 'visible' : 'hidden')};
	overflow: hidden;
`;

export const StyledListItemLevelBox = styled(Box, {
	shouldForwardProp: (prop) => prop !== 'status',
})`
	padding: ${({ theme }) => `${theme.spacing(0.5)} ${theme.spacing(1)}`};
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
`;

export const StyledListItemBottomWrapper = styled(Box)`
	width: 100%;

	margin-top: ${({ theme }) => theme.spacing(2)};
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
