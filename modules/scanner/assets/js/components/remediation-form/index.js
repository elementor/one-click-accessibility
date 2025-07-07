import CopyIcon from '@elementor/icons/CopyIcon';
import InfoCircleIcon from '@elementor/icons/InfoCircleIcon';
import Box from '@elementor/ui/Box';
import IconButton from '@elementor/ui/IconButton';
import Infotip from '@elementor/ui/Infotip';
import Tooltip from '@elementor/ui/Tooltip';
import Typography from '@elementor/ui/Typography';
import { RemediationSnippet } from '@ea11y-apps/scanner/components/remediation-form/remediation-snippet';
import { uxMessaging } from '@ea11y-apps/scanner/constants/ux-messaging';
import { useCopyToClipboard } from '@ea11y-apps/scanner/hooks/use-copy-to-clipboard';
import { StyledAlert } from '@ea11y-apps/scanner/styles/app.styles';
import {
	InfotipBox,
	StyledAccordionDetails,
	StyledSnippet,
} from '@ea11y-apps/scanner/styles/manual-fixes.styles';
import { remediationItem } from '@ea11y-apps/scanner/types/remediation-item';
import { __ } from '@wordpress/i18n';

export const RemediationForm = ({ item }) => {
	const { copied, copyToClipboard } = useCopyToClipboard();
	const content = JSON.parse(item.content);

	return (
		<>
			<StyledAccordionDetails>
				<Box>
					<Box display="flex" gap={1} alignItems="center">
						<Typography variant="subtitle2">
							{__('What’s the issue', 'pojo-accessibility')}
						</Typography>
						<Infotip
							placement="top"
							PopperProps={{
								disablePortal: true,
							}}
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
										{uxMessaging[item.rule].whyItMatters}
									</Typography>
								</InfotipBox>
							}
						>
							<InfoCircleIcon fontSize="small" />
						</Infotip>
					</Box>
					<Typography variant="body2">
						{uxMessaging[item.rule]?.whatsTheIssue}
					</Typography>
				</Box>
				<Box>
					<Typography variant="subtitle2" sx={{ mb: 0.5 }}>
						{__('Affected element:', 'pojo-accessibility')}
					</Typography>
					<StyledAlert color="error" icon={false}>
						<Box display="flex" gap={0.5} alignItems="start">
							<StyledSnippet variant="body2">{content.find}</StyledSnippet>
							<Box>
								<Tooltip
									arrow
									placement="bottom"
									title={
										copied
											? __('Copied!', 'pojo-accessibility')
											: __('Copy', 'pojo-accessibility')
									}
									PopperProps={{
										disablePortal: true,
									}}
								>
									<IconButton
										size="tiny"
										onClick={copyToClipboard(
											content.find,
											'error_snippet',
											'remediation',
										)}
									>
										<CopyIcon fontSize="tiny" />
									</IconButton>
								</Tooltip>
							</Box>
						</Box>
					</StyledAlert>
				</Box>
				<RemediationSnippet item={item} />
			</StyledAccordionDetails>
		</>
	);
};

RemediationForm.propTypes = {
	item: remediationItem,
};
