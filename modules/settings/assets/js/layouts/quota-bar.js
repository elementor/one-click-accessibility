import { ChevronUpIcon, CrownIcon, EyeIcon } from '@elementor/icons';
import Box from '@elementor/ui/Box';
import Button from '@elementor/ui/Button';
import Card from '@elementor/ui/Card';
import CardActionArea from '@elementor/ui/CardActionArea';
import CardContent from '@elementor/ui/CardContent';
import CardGroup from '@elementor/ui/CardGroup';
import CardHeader from '@elementor/ui/CardHeader';
import Chip from '@elementor/ui/Chip';
import Collapse from '@elementor/ui/Collapse';
import IconButton from '@elementor/ui/IconButton';
import Rotate from '@elementor/ui/Rotate';
import Skeleton from '@elementor/ui/Skeleton';
import { styled } from '@elementor/ui/styles';
import {
	QuotaBar as QuotaBarComponent,
	QuotaIndicator,
} from '@ea11y/components';
import { useSavedSettings, useSettings } from '@ea11y/hooks';
import { eventNames, mixpanelService } from '@ea11y-apps/global/services';
import { useState } from '@wordpress/element';
import { __ } from '@wordpress/i18n';
import { GOLINKS } from '../constants/index';
import { openLink } from '../utils';

const QuotaBar = () => {
	const { openSidebar, setOpenSidebar, planData } = useSettings();
	const { loading } = useSavedSettings();

	const [open, setOpen] = useState(false);

	const toggleOpen = () => setOpen((prev) => !prev);

	/**
	 * Send an event to the Mixpanel when the user clicks on the "Add visits" button and open the link.
	 */
	const handleAddVisitsClick = () => {
		mixpanelService.sendEvent(eventNames.upgradeButtonClicked, {
			feature: 'add visits',
			component: 'quota counter',
		});
		openLink(GOLINKS.ADD_VISITS);
	};

	const QuotaTitle = () => (
		<Box display="flex" alignItems="center" gap={1}>
			{__('Current Plan', 'pojo-accessibility')}
			<Chip variant="filled" label={planData?.plan?.name} size="tiny" />
			{planData && <QuotaIndicator data={planData} isQuotaBoxOpen={open} />}
		</Box>
	);

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
				<IconButton onClick={() => setOpenSidebar(true)} sx={{ padding: 0 }}>
					<EyeIcon sx={{ color: 'common.black', marginRight: 1 }} />
				</IconButton>
			</StyledBox>
		);
	}

	return (
		<StyledBox>
			<StyledCardGroup>
				<Card elevation={0} sx={{ overflow: 'visible' }}>
					<StyledCardActionArea onClick={toggleOpen}>
						<StyledCardHeader
							title={<QuotaTitle />}
							action={
								<Rotate in={open}>
									<ChevronUpIcon />
								</Rotate>
							}
							disableActionOffset
						/>
					</StyledCardActionArea>
					<Collapse in={open}>
						<StyledCardContentInner>
							<QuotaBarComponent type="visits" quotaData={planData?.visits} />
							<QuotaBarComponent
								type="scanner"
								quotaData={planData?.scannedPages}
							/>
							<QuotaBarComponent type="ai" quotaData={planData?.aiCredits} />
						</StyledCardContentInner>
					</Collapse>
				</Card>
				<Card elevation={0}>
					<StyledCardContent>
						<StyledButton
							variant="outlined"
							startIcon={<CrownIcon />}
							onClick={handleAddVisitsClick}
							size="small"
							fullWidth
						>
							{__('Upgrade plan', 'pojo-accessibility')}
						</StyledButton>
					</StyledCardContent>
				</Card>
			</StyledCardGroup>
		</StyledBox>
	);
};

export default QuotaBar;

const StyledBox = styled(Box)`
	display: flex;
	flex-direction: row;
	align-items: start;
	justify-content: center;
	margin: ${({ theme }) => theme.spacing(2)};
	padding: 0;
`;

const StyledCardGroup = styled(CardGroup)`
	border: 1px solid ${({ theme }) => theme.palette.divider};
	border-radius: 8px;
	padding: 12px 16px;
	width: 100%;
`;

const StyledCardContent = styled(CardContent)`
	padding: 0;
	:last-child {
		padding-bottom: 0;
	}
`;

const StyledCardContentInner = styled(CardContent)`
	padding: 0;
	padding-top: ${({ theme }) => theme.spacing(1)};
	:last-child {
		padding-bottom: ${({ theme }) => theme.spacing(2)};
	}
`;

const StyledCardHeader = styled(CardHeader)`
	padding: 0;
	margin-bottom: ${({ theme }) => theme.spacing(1)};
`;

const StyledButton = styled(Button)`
	border-color: ${({ theme }) => theme.palette.promotion.main};
	color: ${({ theme }) => theme.palette.promotion.main};
`;

const StyledCardActionArea = styled(CardActionArea)`
	&:hover {
		background-color: transparent;
	}
`;
