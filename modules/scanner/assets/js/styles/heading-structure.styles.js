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

export const StyledTreeListItem = styled('li')`
	display: flex;
	flex-direction: column;
	justify-content: center;
	align-items: flex-start;

	padding: ${({ theme }) => `${theme.spacing(1.25)} ${theme.spacing(1)}`};
	margin-bottom: ${({ theme }) => theme.spacing(1.25)};
	border: 1px solid ${({ theme }) => theme.palette.divider};

	border-radius: ${({ theme }) => theme.shape.borderRadius}px;
	cursor: pointer;
`;

export const StyledListItemTopWrapper = styled(Box)`
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

export const StyledListItemLevelBox = styled(Box)`
	padding: 4px 8px;
	margin-inline-end: ${({ theme }) => theme.spacing(1)};

	border: 1px solid ${({ status }) => STATUS_CONFIG[status].borderColor};
	background: #f3f3f4;
	border-radius: ${({ theme }) => theme.shape.borderRadius}px;

	span {
		color: ${({ status }) => STATUS_CONFIG[status].textColor};
	}
`;

export const StyledListItemContent = styled(Typography)`
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
