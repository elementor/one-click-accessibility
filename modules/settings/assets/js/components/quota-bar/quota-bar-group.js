import ChevronUpIcon from '@elementor/icons/ChevronUpIcon';
import CrownIcon from '@elementor/icons/CrownIcon';
import Box from '@elementor/ui/Box';
import Button from '@elementor/ui/Button';
import Card from '@elementor/ui/Card';
import CardActionArea from '@elementor/ui/CardActionArea';
import CardContent from '@elementor/ui/CardContent';
import CardGroup from '@elementor/ui/CardGroup';
import CardHeader from '@elementor/ui/CardHeader';
import Chip from '@elementor/ui/Chip';
import Collapse from '@elementor/ui/Collapse';
import Rotate from '@elementor/ui/Rotate';
import { styled } from '@elementor/ui/styles';
import {
	QuotaBar as QuotaBarComponent,
	QuotaIndicator,
} from '@ea11y/components';
import { useSettings } from '@ea11y/hooks';
import { GOLINKS } from '@ea11y-apps/global/constants';
import { mixpanelEvents, mixpanelService } from '@ea11y-apps/global/services';
import { useState } from '@wordpress/element';
import { __ } from '@wordpress/i18n';
import { openLink } from '../../utils';

const QuotaBarGroup = ({ collapsible = true, popup = false }) => {
	const { planData } = useSettings();
	const [open, setOpen] = useState(false);

	const toggleOpen = () => setOpen((prev) => !prev);

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
		<Box display="flex" alignItems="center" gap={1} whiteSpace="nowrap">
			{__('Current Plan', 'pojo-accessibility')}
			<Chip variant="filled" label={planData?.plan?.name} size="tiny" />
			<QuotaIndicator />
		</Box>
	);

	const QuotaBars = () => (
		<StyledCardContentInner>
			<QuotaBarComponent type="scanner" quotaData={planData?.scannedPages} />
			<QuotaBarComponent type="ai" quotaData={planData?.aiCredits} />
		</StyledCardContentInner>
	);

	return (
		<StyledBox popup={popup}>
			<StyledCardGroup>
				<Card elevation={0} sx={{ overflow: 'visible' }}>
					<StyledCardActionArea onClick={toggleOpen}>
						<StyledCardHeader
							title={<QuotaTitle />}
							action={
								collapsible && (
									<Rotate in={open}>
										<ChevronUpIcon />
									</Rotate>
								)
							}
							disableActionOffset
						/>
					</StyledCardActionArea>
					{collapsible && (
						<Collapse in={open}>
							<QuotaBars />
						</Collapse>
					)}
					{!collapsible && <QuotaBars />}
				</Card>
				<Card elevation={0}>
					<StyledCardContent>
						<Button
							variant="outlined"
							startIcon={planData?.plan?.name === 'Free' ? <CrownIcon /> : null}
							onClick={handleAddVisitsClick}
							size="small"
							fullWidth
							color={planData?.plan?.name === 'Free' ? 'promotion' : 'info'}
						>
							{planData?.plan?.name === 'Free'
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

const StyledBox = styled(Box, {
	shouldForwardProp: (prop) => prop !== 'popup',
})`
	display: flex;
	flex-direction: row;
	align-items: start;
	justify-content: center;
	max-width: 230px;

	margin: ${({ popup, theme }) => (popup ? '0' : theme.spacing(2))};
	padding: 0;

	border-radius: ${({ theme }) => theme.shape.borderRadius * 2}px;

	:hover {
		background-color: ${({ popup, theme }) =>
			popup ? theme.palette.common.white : theme.palette.action.hover};
	}
`;

const StyledCardGroup = styled(CardGroup)`
	border: none;
	border-radius: ${({ theme }) => theme.shape.borderRadius * 2}px;
	padding: ${({ theme }) => `${theme.spacing(1.5)} ${theme.spacing(2)}`};
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

const StyledCardContentInner = styled(CardContent)`
	padding: 0;
	background-color: transparent;
	padding-top: ${({ theme }) => theme.spacing(1)};
	:last-child {
		padding-bottom: ${({ theme }) => theme.spacing(2)};
	}
`;

const StyledCardHeader = styled(CardHeader)`
	padding: 0;
	background-color: transparent;
	margin-bottom: ${({ theme }) => theme.spacing(1)};
`;

const StyledCardActionArea = styled(CardActionArea)`
	background-color: transparent;
	button {
		&:hover {
			background-color: transparent;
		}
	}
`;
