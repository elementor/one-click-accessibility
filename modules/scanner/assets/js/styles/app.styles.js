import BanIcon from '@elementor/icons/BanIcon';
import Alert from '@elementor/ui/Alert';
import Box from '@elementor/ui/Box';
import Button from '@elementor/ui/Button';
import Card from '@elementor/ui/Card';
import CardContent from '@elementor/ui/CardContent';
import Chip from '@elementor/ui/Chip';
import MenuItemText from '@elementor/ui/MenuItemText';
import Paper from '@elementor/ui/Paper';
import Skeleton from '@elementor/ui/Skeleton';
import TabPanel from '@elementor/ui/TabPanel';
import Tabs from '@elementor/ui/Tabs';
import Typography from '@elementor/ui/Typography';
import { styled } from '@elementor/ui/styles';
import { ColorPickerStyles } from '@ea11y-apps/scanner/styles/react-colourful.styles';

export const AppContainer = styled(Paper)`
	position: relative;
	width: 425px;
	min-height: 100vh;
	height: fit-content;
	pointer-events: auto;

	// Include color picker styles to styled components for prevent problem with cache
	${ColorPickerStyles}
`;

export const AppsTabs = styled(Tabs)`
	& .MuiTabs-indicator {
		background-color: ${({ theme }) => theme.palette.info.main};
	}

	& .MuiTab-root.Mui-selected {
		color: ${({ theme }) => theme.palette.info.main};
		font-weight: 400;
	}
`;

export const AppsTabPanel = styled(TabPanel)`
	padding: 0;
`;

export const StyledStatsBlock = styled(Card)`
	margin: ${({ theme }) => `${theme.spacing(3)} ${theme.spacing(2)}`};
	padding: ${({ theme }) => theme.spacing(2)};

	border-radius: ${({ theme }) => theme.shape.borderRadius}px;
	box-shadow: 0 3px 14px 2px rgba(0, 0, 0, 0.12);
`;

export const TitleBox = styled(Box)`
	display: flex;
	gap: ${({ theme }) => theme.spacing(1)};
	align-items: center;
`;

export const StyledTitle = styled(Typography)`
	font-size: 16px;
	font-weight: 500;
	line-height: 130%;
	letter-spacing: 0.15px;
	margin: 0;

	.MuiChip-root {
		margin-inline-start: ${({ theme }) => theme.spacing(1)};

		font-weight: 400;
	}
`;

export const StyledHeaderTitleWrapper = styled(Box)`
	padding: ${({ theme }) => `${theme.spacing(1)} ${theme.spacing(1.5)}`};
`;

export const StyledHeaderContent = styled(Box)`
	padding: ${({ theme }) => `${theme.spacing(1)} ${theme.spacing(1.5)}`};
`;

export const StyledContent = styled(CardContent)`
	padding: 0 ${({ theme }) => theme.spacing(2)};
`;

export const SkeletonContainer = styled(Box)`
	display: flex;
	gap: ${({ theme }) => theme.spacing(1)};
	flex-direction: column;
	padding: 0 ${({ theme }) => theme.spacing(2)};
`;

export const StyledSkeleton = styled(Skeleton)`
	transform: scale(1);
`;

const disabledState = `
		cursor: not-allowed;
		& * {
			pointer-events: none;
		}
	`;

export const StyledAlert = styled(Alert)`
	align-items: center;
	/* @noflip */
	direction: ltr;
	& .MuiAlert-icon,
	& .MuiAlert-content {
		padding-top: 0;
		display: flex;
	}
`;

export const AlertWithDisabledState = styled(Alert)`
	${({ disabled }) => (disabled ? disabledState : '')}
	${({ disabled, theme }) =>
		disabled
			? `
			& * {
				color: ${theme.palette.text.disabled};
			}
			& svg {
				fill: ${theme.palette.text.disabled};
			} 
	`
			: ''}
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

export const QuotaMessageContainer = styled(Box)`
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	gap: ${({ theme }) => theme.spacing(2)};
	margin-bottom: ${({ theme }) => theme.spacing(2)};
	padding-inline: ${({ theme }) => theme.spacing(2)};
`;

export const ReconnectDescription = styled(Typography)`
	max-width: 250px;
	text-align: center;
	margin-bottom: ${({ theme }) => theme.spacing(2)};
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

	&:focus .MuiPaper-root,
	&:focus-visible .MuiPaper-root {
		background-color: ${({ theme }) => theme.palette.action.hover};
	}
`;

export const ManageButtonWrap = styled(Box)`
	display: flex;
	align-items: center;
	gap: ${({ theme }) => theme.spacing(1.5)};
	border: 1px solid ${({ theme }) => theme.palette.action.focus};
	border-radius: ${({ theme }) => theme.shape.borderRadius}px;
	padding-right: ${({ theme }) => theme.spacing(1.5)};
	&:hover,
	&:focus .MuiPaper-root,
	&:focus-visible .MuiPaper-root {
		background-color: ${({ theme }) => theme.palette.action.hover};
	}
`;

export const ActionButton = styled(Button)`
	font-weight: 400;
	justify-content: start;
	padding: ${({ theme }) => theme.spacing(1.5)};

	&:hover,
	&:focus,
	&:focus-visible {
		background-color: transparent;
	}
`;

export const UpgradeContentContainer = styled(Box)`
	display: flex;
	justify-content: space-between;
	align-items: flex-start;
`;

export const ResolvedButtonsBox = styled(Box)`
	display: flex;
	justify-content: center;
	width: 100%;
	gap: ${({ theme }) => theme.spacing(1)};
`;

export const StyledBlockButtonsBox = styled(Box)`
	display: flex;
	flex-direction: column;
	gap: ${({ theme }) => theme.spacing(1)};
`;

export const DisabledMenuItemText = styled(MenuItemText)`
	color: ${({ theme }) => theme.palette.text.disabled};
`;

export const StyledBanIcon = styled(BanIcon)`
	transform: rotate(-45deg);
`;

export const StyledBox = styled(Box)`
	display: flex;
	flex-direction: column;
	gap: ${({ theme }) => theme.spacing(3)};
`;

export const ManageColorAlert = styled(Alert)`
	padding: ${({ theme }) => `${theme.spacing(1)} ${theme.spacing(1.5)};`};
	& .MuiAlert-content {
		padding-top: 0;
	}
	& .MuiAlert-content > div {
		display: block;
	}
`;

export const StyledProChip = styled(Chip)`
	margin-left: ${({ theme }) => theme.spacing(1)};
	height: 26px;
	width: 26px;

	.MuiChip-label {
		padding: 0;
	}
`;
