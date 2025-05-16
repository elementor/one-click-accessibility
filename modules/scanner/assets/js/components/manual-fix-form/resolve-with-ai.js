import AIIcon from '@elementor/icons/AIIcon';
import CopyIcon from '@elementor/icons/CopyIcon';
import CrownIcon from '@elementor/icons/CrownIcon';
import InfoCircleIcon from '@elementor/icons/InfoCircleIcon';
import XIcon from '@elementor/icons/XIcon';
import Box from '@elementor/ui/Box';
import Button from '@elementor/ui/Button';
import Card from '@elementor/ui/Card';
import CardActions from '@elementor/ui/CardActions';
import CardContent from '@elementor/ui/CardContent';
import IconButton from '@elementor/ui/IconButton';
import Infotip from '@elementor/ui/Infotip';
import Tooltip from '@elementor/ui/Tooltip';
import Typography from '@elementor/ui/Typography';
import PropTypes from 'prop-types';
import { uxMessaging } from '@ea11y-apps/scanner/constants/ux-messaging';
import { useScannerWizardContext } from '@ea11y-apps/scanner/context/scanner-wizard-context';
import { useManualFixForm } from '@ea11y-apps/scanner/hooks/useManualFixForm';
import { StyledAlert } from '@ea11y-apps/scanner/styles/app.styles';
import {
	InfotipBox,
	InfotipFooter,
	StyledSnippet,
} from '@ea11y-apps/scanner/styles/manual-fixes.styles';
import { scannerItem } from '@ea11y-apps/scanner/types/scanner-item';
import { useState } from '@wordpress/element';
import { __ } from '@wordpress/i18n';

export const ResolveWithAi = ({ item, current }) => {
	const { manualData, openedBlock } = useScannerWizardContext();
	const { getAISuggestion, copyToClipboard, copied } = useManualFixForm({
		item,
		current,
	});

	const [openUpgrade, setOpenUpgrade] = useState(false);
	const [loading, setLoading] = useState(false);

	//TODO: replace with correct feature
	const isAIEnabled =
		window.ea11yScannerData?.planData?.plan?.features?.analytics;
	const aiSuggestion = manualData[openedBlock][current]?.aiSuggestion;

	const handleButtonClick = async () => {
		if (isAIEnabled) {
			try {
				setLoading(true);
				await getAISuggestion();
			} finally {
				setLoading(false);
			}
		} else {
			setOpenUpgrade(true);
		}
	};

	const closeUpgrade = () => setOpenUpgrade(false);

	return aiSuggestion ? (
		<Box>
			<Card variant="outlined" sx={{ overflow: 'visible' }}>
				<CardContent sx={{ pb: 0 }}>
					<Box display="flex" gap={1} alignItems="center" sx={{ mb: 2 }}>
						<AIIcon />
						<Typography variant="subtitle1">
							{__('Resolve with AI', 'pojo-accessibility')}
						</Typography>
						<Infotip
							placement="top"
							content={
								<InfotipBox>
									<Typography
										variant="subtitle1"
										sx={{ mb: 1, textTransform: 'none' }}
									>
										{__(
											"What's the issue and why it matters?",
											'pojo-accessibility',
										)}
									</Typography>
									<Typography variant="body2">
										{uxMessaging[item.ruleId].whyItMatters}
									</Typography>
								</InfotipBox>
							}
						>
							<InfoCircleIcon fontSize="small" />
						</Infotip>
					</Box>
					<StyledAlert color="info" icon={false}>
						<Box display="flex" gap={0.5} alignItems="start">
							<StyledSnippet variant="body1" sx={{ width: '290px' }}>
								{item.snippet}
							</StyledSnippet>
							<Box>
								<Tooltip
									placement="left"
									title={
										copied
											? __('Copied!', 'pojo-accessibility')
											: __('Copy', 'pojo-accessibility')
									}
									id="copy-icon"
									arrow
								>
									<IconButton
										size="medium"
										onClick={copyToClipboard(item.snippet)}
										aria-labelledby="copy-icon"
									>
										<CopyIcon />
									</IconButton>
								</Tooltip>
							</Box>
						</Box>
					</StyledAlert>
				</CardContent>
				<CardActions sx={{ p: 2 }}>
					<Button size="small" color="secondary" variant="text">
						{__('Retry', 'pojo-accessibility')}
					</Button>
					<Button size="small" color="info" variant="contained">
						{__('Apply fix', 'pojo-accessibility')}
					</Button>
				</CardActions>
			</Card>
		</Box>
	) : (
		<Box>
			<Infotip
				placement="top"
				onClose={closeUpgrade}
				open={openUpgrade}
				disableFocusListener
				disableHoverListener
				disableTouchListener
				content={
					<InfotipBox>
						<Box
							display="flex"
							justifyContent="space-between"
							alignItems="start"
						>
							<Typography variant="subtitle1" sx={{ mb: 3 }}>
								{__(
									'Resolve issues automatically with AI',
									'pojo-accessibility',
								)}
							</Typography>
							<IconButton
								onClick={closeUpgrade}
								size="small"
								edge="end"
								sx={{ mt: -1 }}
							>
								<XIcon />
							</IconButton>
						</Box>
						<Typography variant="body2" sx={{ mb: 2 }}>
							{__(
								"Upgrade your plan to skip the manual work and have Ally's AI auto-resolve accessibility issues for you.",
								'pojo-accessibility',
							)}
						</Typography>
						<InfotipFooter>
							<Button
								size="small"
								color="promotion"
								variant="contained"
								href="#"
								target="_blank"
								rel="noreferrer"
								startIcon={<CrownIcon />}
							>
								{__('Upgrade now', 'pojo-accessibility')}
							</Button>
						</InfotipFooter>
					</InfotipBox>
				}
			>
				<Button
					variant="contained"
					color={isAIEnabled ? 'info' : 'promotion'}
					startIcon={<AIIcon />}
					fullWidth
					disabled={loading}
					loading={loading}
					onClick={handleButtonClick}
				>
					{__('Let AI resolve it for you', 'pojo-accessibility')}
				</Button>
			</Infotip>
		</Box>
	);
};

ResolveWithAi.propTypes = {
	item: scannerItem,
	current: PropTypes.number.isRequired,
};
