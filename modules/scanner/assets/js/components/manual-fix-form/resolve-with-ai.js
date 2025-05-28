import AIIcon from '@elementor/icons/AIIcon';
import CopyIcon from '@elementor/icons/CopyIcon';
import InfoCircleIcon from '@elementor/icons/InfoCircleIcon';
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
import { UpgradeInfoTip } from '@ea11y-apps/scanner/components/upgrade-info-tip';
import { AI_QUOTA_LIMIT, IS_AI_ENABLED } from '@ea11y-apps/scanner/constants';
import { useScannerWizardContext } from '@ea11y-apps/scanner/context/scanner-wizard-context';
import { useManualFixForm } from '@ea11y-apps/scanner/hooks/useManualFixForm';
import { StyledAlert } from '@ea11y-apps/scanner/styles/app.styles';
import {
	InfotipBox,
	StyledSnippet,
} from '@ea11y-apps/scanner/styles/manual-fixes.styles';
import { scannerItem } from '@ea11y-apps/scanner/types/scanner-item';
import { useState } from '@wordpress/element';
import { __ } from '@wordpress/i18n';

export const ResolveWithAi = ({ item, current }) => {
	const { manualData, openedBlock } = useScannerWizardContext();
	const {
		getAISuggestion,
		copyToClipboard,
		resolveIssue,
		copied,
		aiResponseLoading,
		resolving,
	} = useManualFixForm({
		item,
		current,
	});

	const [openUpgrade, setOpenUpgrade] = useState(false);
	const aiSuggestion = manualData[openedBlock][current]?.aiSuggestion;

	const handleButtonClick = async () => {
		if (IS_AI_ENABLED && AI_QUOTA_LIMIT) {
			await getAISuggestion();
		} else {
			setOpenUpgrade(true);
		}
	};

	const closeUpgrade = () => setOpenUpgrade(false);

	const disabled = aiResponseLoading || resolving;

	return aiSuggestion ? (
		<Box>
			<Card variant="outlined" sx={{ overflow: 'visible' }}>
				<CardContent sx={{ pb: 0 }}>
					<Box display="flex" gap={1} alignItems="center" sx={{ mb: 2 }}>
						<AIIcon />
						<Typography variant="subtitle1">
							{__('Resolve with AI', 'pojo-accessibility')}
						</Typography>
						{aiSuggestion.explanation && (
							<Infotip
								placement="top"
								content={
									<InfotipBox>
										<Typography
											variant="subtitle1"
											sx={{ mb: 1, textTransform: 'none' }}
										>
											{__('How AI resolves this?', 'pojo-accessibility')}
										</Typography>
										<Typography variant="body2">
											{aiSuggestion.explanation}
										</Typography>
									</InfotipBox>
								}
							>
								<InfoCircleIcon fontSize="small" />
							</Infotip>
						)}
					</Box>
					<StyledAlert color="info" icon={false} disabled={disabled}>
						<Box display="flex" gap={0.5} alignItems="start">
							<StyledSnippet variant="body2" sx={{ width: '290px' }}>
								{aiSuggestion.snippet}
							</StyledSnippet>
							<Box>
								<Tooltip
									arrow
									placement="bottom"
									title={
										copied
											? __('Copied!', 'pojo-accessibility')
											: __('Copy', 'pojo-accessibility')
									}
									id="copy-icon-ai"
									PopperProps={{
										disablePortal: true,
									}}
								>
									<IconButton
										size="tiny"
										onClick={copyToClipboard(item.snippet)}
										aria-labelledby="copy-icon-ai"
									>
										<CopyIcon fontSize="tiny" />
									</IconButton>
								</Tooltip>
							</Box>
						</Box>
					</StyledAlert>
				</CardContent>
				<CardActions sx={{ p: 2 }}>
					<Tooltip
						arrow
						placement="bottom"
						title={__('Generate another solution', 'pojo-accessibility')}
						id="copy-icon-ai"
						PopperProps={{
							disablePortal: true,
						}}
					>
						<Button
							size="small"
							color="secondary"
							variant="text"
							onClick={handleButtonClick}
							disabled={disabled}
							loading={aiResponseLoading}
							loadingPosition="start"
						>
							{__('Retry', 'pojo-accessibility')}
						</Button>
					</Tooltip>
					<Button
						size="small"
						color="info"
						variant="contained"
						disabled={disabled}
						loading={resolving}
						loadingPosition="start"
						onClick={resolveIssue}
					>
						{__('Apply fix', 'pojo-accessibility')}
					</Button>
				</CardActions>
			</Card>
		</Box>
	) : (
		<Box>
			<UpgradeInfoTip closeUpgrade={closeUpgrade} openUpgrade={openUpgrade}>
				<Button
					variant="contained"
					size="small"
					color={IS_AI_ENABLED && AI_QUOTA_LIMIT ? 'info' : 'promotion'}
					startIcon={<AIIcon />}
					fullWidth
					disabled={aiResponseLoading}
					loading={aiResponseLoading}
					onClick={handleButtonClick}
				>
					{__('Let AI resolve it for you', 'pojo-accessibility')}
				</Button>
			</UpgradeInfoTip>
		</Box>
	);
};

ResolveWithAi.propTypes = {
	item: scannerItem,
	current: PropTypes.number.isRequired,
};
