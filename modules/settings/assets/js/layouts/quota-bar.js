import CalendarDollarIcon from '@elementor/icons/CalendarDollarIcon';
import Box from '@elementor/ui/Box';
import IconButton from '@elementor/ui/IconButton';
import Skeleton from '@elementor/ui/Skeleton';
import { styled } from '@elementor/ui/styles';
import {
	bindMenu,
	bindTrigger,
	usePopupState,
} from '@elementor/ui/usePopupState';
import {
	QuotaBarGroup,
	QuotaBarPopupMenu,
	QuotaIndicator,
} from '@ea11y/components';
import { useSavedSettings, useSettings } from '@ea11y/hooks';

const QuotaBar = () => {
	const { openSidebar } = useSettings();
	const { loading } = useSavedSettings();

	const quotaPopupMenuState = usePopupState({
		variant: 'popover',
		popupId: 'quotaPopupMenu',
	});

	if (loading) {
		return (
			<StyledBox>
				<Skeleton width="100%" height={91} />
			</StyledBox>
		);
	}

	if (!openSidebar) {
		return (
			<StyledBox>
				<StyledIconButton {...bindTrigger(quotaPopupMenuState)}>
					<CalendarDollarIcon sx={{ color: 'common.black', marginRight: 1 }} />
					<QuotaIndicator />
				</StyledIconButton>
				<QuotaBarPopupMenu
					{...bindMenu(quotaPopupMenuState)}
					closeAction={quotaPopupMenuState.close}
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

	border-radius: ${({ theme }) => theme.shape.borderRadius * 2}px;
`;

const StyledIconButton = styled(IconButton)`
	padding: ${({ theme }) => theme.spacing(1)} ${({ theme }) => theme.spacing(2)};
	background-color: ${({ theme }) => theme.palette.background.paper};
	border-radius: 8px;

	&:hover {
		background-color: ${({ theme }) => theme.palette.action.hover};
	}
`;
