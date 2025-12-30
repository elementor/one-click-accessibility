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
import { mixpanelEvents, mixpanelService } from '@ea11y-apps/global/services';
import { useRef, useState } from '@wordpress/element';
import { __ } from '@wordpress/i18n';
import { openLink } from '../../utils';

const QuotaBarGroup = () => {
	const { planData } = useSettings();
	const anchorEl = useRef(null);
	const [isOpened, setIsOpened] = useState(false);

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
		openLink(GOLINKS.ADD_VISITS);
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
			<Chip
				variant="filled"
				size="tiny"
				label={planData?.plan?.name}
				sx={{ fontWeight: '400' }}
			/>
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
						<Button
							variant="outlined"
							startIcon={isFree ? <CrownIcon /> : null}
							onClick={handleAddVisitsClick}
							size="small"
							fullWidth
							color={isFree ? 'promotion' : 'secondary'}
						>
							{isFree
								? __('Upgrade plan', 'pojo-accessibility')
								: __('View more plans', 'pojo-accessibility')}
						</Button>
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

	:last-of-type {
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
