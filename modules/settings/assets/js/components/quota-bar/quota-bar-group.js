import ChevronDownSmallIcon from '@elementor/icons/ChevronDownSmallIcon';
import CrownIcon from '@elementor/icons/CrownIcon';
import Box from '@elementor/ui/Box';
import Button from '@elementor/ui/Button';
import Card from '@elementor/ui/Card';
import CardActionArea from '@elementor/ui/CardActionArea';
import CardContent from '@elementor/ui/CardContent';
import CardGroup from '@elementor/ui/CardGroup';
import CardHeader from '@elementor/ui/CardHeader';
import Chip from '@elementor/ui/Chip';
import Rotate from '@elementor/ui/Rotate';
import Typography from '@elementor/ui/Typography';
import { styled } from '@elementor/ui/styles';
import {
	bindMenu,
	bindTrigger,
	usePopupState,
} from '@elementor/ui/usePopupState';
import { PopupMenu, QuotaIndicator } from '@ea11y/components';
import { useSettings } from '@ea11y/hooks';
import { GOLINKS } from '@ea11y-apps/global/constants';
import { useAuth } from '@ea11y-apps/global/hooks/use-auth';
import { mixpanelEvents, mixpanelService } from '@ea11y-apps/global/services';
import { getUpgradeLink } from '@ea11y-apps/global/utils/upgrade-link';
import { useRef, useState, useEffect } from '@wordpress/element';
import { __ } from '@wordpress/i18n';
import { usePluginSettingsContext } from '../../contexts/plugin-settings';
import { openLink } from '../../utils';

const QuotaBarGroup = () => {
	const { planData } = useSettings();
	const anchorEl = useRef(null);
	const [isOpened, setIsOpened] = useState(false);
	const [showRenew, setShowRenew] = useState(false);
	const { isConnected } = usePluginSettingsContext();
	const { redirectToConnect } = useAuth();

	useEffect(() => {
		if (new Date(planData?.plan?.next_cycle_date) < new Date()) {
			setShowRenew(true);
		}
	}, [planData?.plan?.next_cycle_date]);

	const isFree = planData?.plan?.name === 'Free';

	const handleClick = () => setIsOpened(!isOpened);

	const quotaPopupMenuState = usePopupState({
		variant: 'popover',
		popupId: 'popupMenuCollapsedSidebar',
	});

	/**
	 * Send an event to the Mixpanel when the user clicks on the "Add visits" button and open the link.
	 */
	const handleAddVisitsClick = () => {
		mixpanelService.sendEvent(mixpanelEvents.upgradeButtonClicked, {
			feature: 'add visits',
			component: 'quota counter',
		});
		openLink(getUpgradeLink(GOLINKS.ADD_VISITS));
	};

	const QuotaTitle = () => (
		<Box
			display="flex"
			alignItems="center"
			gap={1}
			whiteSpace="nowrap"
			{...bindTrigger(quotaPopupMenuState)}
		>
			<Typography variant="body2" as="div">
				{__('Current plan', 'pojo-accessibility')}
			</Typography>
			{showRenew ? (
				<Chip
					variant="filled"
					color="error"
					label={__('Expired', 'pojo-accessibility')}
					size="tiny"
				/>
			) : (
				<Chip
					variant="filled"
					color={isConnected ? 'default' : 'error'}
					label={
						isConnected
							? planData?.plan?.name
							: __('Not connected', 'pojo-accessibility')
					}
					size="tiny"
				/>
			)}
			<QuotaIndicator />
		</Box>
	);

	return (
		<StyledBox>
			<StyledCardGroup ref={anchorEl}>
				<Card elevation={0} sx={{ overflow: 'visible' }}>
					<StyledCardActionArea onClick={handleClick}>
						<StyledCardHeader
							title={<QuotaTitle />}
							action={
								<Rotate in={!isOpened}>
									<ChevronDownSmallIcon />
								</Rotate>
							}
							disableActionOffset
						/>
					</StyledCardActionArea>
					<PopupMenu
						{...bindMenu(quotaPopupMenuState)}
						closeAction={quotaPopupMenuState.close}
						showUpgradeButton="false"
						anchorOrigin={{
							vertical: 'top',
							horizontal: 'center',
						}}
						transformOrigin={{
							vertical: 'bottom',
							horizontal: 'center',
						}}
						open={isOpened}
						onClose={handleClick}
						anchorEl={anchorEl.current}
					/>
				</Card>
				<Card elevation={0}>
					<StyledCardContent>
						{isConnected || showRenew ? (
							<Button
								variant="outlined"
								startIcon={isFree || showRenew ? <CrownIcon /> : null}
								size="small"
								fullWidth
								color={isFree || showRenew ? 'promotion' : 'secondary'}
								onClick={handleAddVisitsClick}
							>
								{isFree || showRenew
									? __('Upgrade plan', 'pojo-accessibility')
									: __('View more plans', 'pojo-accessibility')}
							</Button>
						) : (
							<Button
								variant="outlined"
								size="small"
								fullWidth
								color={'promotion'}
								onClick={redirectToConnect}
							>
								{__('Connect to start', 'pojo-accessibility')}
							</Button>
						)}
					</StyledCardContent>
				</Card>
			</StyledCardGroup>
		</StyledBox>
	);
};

export default QuotaBarGroup;

const StyledBox = styled(Box)`
	display: flex;
	flex-direction: row;
	align-items: start;
	justify-content: center;
	max-width: 224px;
	margin: ${({ theme }) => theme.spacing(1)};
	padding: 0;

	border-radius: ${({ theme }) => theme.shape.borderRadius}px;

	&:hover,
	&:focus-within {
		background-color: ${({ theme }) => theme.palette.action.hover};
	}
`;

const StyledCardGroup = styled(CardGroup)`
	display: flex;
	flex-direction: column;
	gap: ${({ theme }) => theme.spacing(1)};

	border: none;
	border-radius: ${({ theme }) => theme.shape.borderRadius}px;
	padding: ${({ theme }) => theme.spacing(1.5)};
	width: 100%;
	background-color: transparent;

	& .MuiPaper-root {
		background-color: transparent;
	}
`;

const StyledCardContent = styled(CardContent)`
	padding: 0;
	background-color: transparent;

	:last-child {
		padding-bottom: 0;
	}
`;

const StyledCardHeader = styled(CardHeader)`
	padding: ${({ theme }) => theme.spacing(0.5)} 0;
	background-color: transparent;
`;

const StyledCardActionArea = styled(CardActionArea)`
	background-color: transparent;
	border-radius: ${({ theme }) => theme.shape.borderRadius}px;

	&:hover {
		background-color: transparent;
	}
	.MuiCardActionArea-focusHighlight {
		background-color: transparent;
	}
`;
