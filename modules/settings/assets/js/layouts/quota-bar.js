import CalendarDollarIcon from '@elementor/icons/CalendarDollarIcon';
import Box from '@elementor/ui/Box';
import IconButton from '@elementor/ui/IconButton';
import Skeleton from '@elementor/ui/Skeleton';
import Tooltip from '@elementor/ui/Tooltip';
import { styled } from '@elementor/ui/styles';
import {
	bindMenu,
	bindTrigger,
	usePopupState,
} from '@elementor/ui/usePopupState';
import { PopupMenu, QuotaBarGroup, QuotaIndicator } from '@ea11y/components';
import { useSavedSettings, useSettings } from '@ea11y/hooks';
import { __ } from '@wordpress/i18n';

const QuotaBar = () => {
	const { openSidebar } = useSettings();
	const { loading, isElementorOne } = useSavedSettings();

	const quotaPopupMenuState = usePopupState({
		variant: 'popover',
		popupId: 'popupMenuExpandedSidebar',
	});

	if (loading && !isElementorOne) {
		return (
			<StyledBox>
				<Skeleton width="100%" height={91} />
			</StyledBox>
		);
	}

	if (!openSidebar) {
		return (
			<StyledBox>
				<Tooltip title={__('My account', 'site-mailer')} placement="right">
					<StyledIconButton {...bindTrigger(quotaPopupMenuState)}>
						<CalendarDollarIcon sx={{ color: 'common.black' }} />
						<QuotaIndicator />
					</StyledIconButton>
				</Tooltip>
				<PopupMenu
					{...bindMenu(quotaPopupMenuState)}
					closeAction={quotaPopupMenuState.close}
					anchorOrigin={{
						vertical: 'bottom',
						horizontal: 'right',
					}}
					transformOrigin={{
						vertical: 'top',
						horizontal: 'left',
					}}
				/>
			</StyledBox>
		);
	}

	return <QuotaBarGroup />;
};

export default QuotaBar;

const StyledBox = styled(Box)`
	display: flex;
	flex-direction: row;
	align-items: start;
	justify-content: center;

	margin: ${({ theme }) => theme.spacing(2)};
	padding: 0;

	border-radius: ${({ theme }) => theme.shape.borderRadius}px;
`;

const StyledIconButton = styled(IconButton)`
	padding: ${({ theme }) => theme.spacing(1)};
	background-color: ${({ theme }) => theme.palette.background.paper};
	border-radius: ${({ theme }) => theme.shape.borderRadius}px;

	&:hover {
		background-color: ${({ theme }) => theme.palette.action.hover};
	}

	&:focus {
		background-color: ${({ theme }) => theme.palette.action.focus};
	}
`;
