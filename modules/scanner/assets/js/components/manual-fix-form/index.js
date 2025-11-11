import CheckIcon from '@elementor/icons/CheckIcon';
import CopyIcon from '@elementor/icons/CopyIcon';
import InfoCircleIcon from '@elementor/icons/InfoCircleIcon';
import XIcon from '@elementor/icons/XIcon';
import AccordionActions from '@elementor/ui/AccordionActions';
import Box from '@elementor/ui/Box';
import Button from '@elementor/ui/Button';
import IconButton from '@elementor/ui/IconButton';
import Infotip from '@elementor/ui/Infotip';
import Link from '@elementor/ui/Link';
import Tooltip from '@elementor/ui/Tooltip';
import Typography from '@elementor/ui/Typography';
import PropTypes from 'prop-types';
import { useToastNotification } from '@ea11y-apps/global/hooks';
import { mixpanelEvents, mixpanelService } from '@ea11y-apps/global/services';
import { APIScanner } from '@ea11y-apps/scanner/api/APIScanner';
import { ResolveWithAi } from '@ea11y-apps/scanner/components/manual-fix-form/resolve-with-ai';
import { BLOCKS, EXCLUDE_FROM_AI } from '@ea11y-apps/scanner/constants';
import { uxMessaging } from '@ea11y-apps/scanner/constants/ux-messaging';
import { useScannerWizardContext } from '@ea11y-apps/scanner/context/scanner-wizard-context';
import { useCopyToClipboard } from '@ea11y-apps/scanner/hooks/use-copy-to-clipboard';
import { useManualFixForm } from '@ea11y-apps/scanner/hooks/use-manual-fix-form';
import { StyledAlert } from '@ea11y-apps/scanner/styles/app.styles';
import {
	InfotipBox,
	InfotipFooter,
	StyledAccordionDetails,
	StyledSnippet,
	TitleBox,
} from '@ea11y-apps/scanner/styles/manual-fixes.styles';
import { scannerItem } from '@ea11y-apps/scanner/types/scanner-item';
import { speak } from '@wordpress/a11y';
import { useState } from '@wordpress/element';
import { __ } from '@wordpress/i18n';

export const ManualFixForm = ({ item, current, setOpen }) => {
	const { openedBlock, currentScanId } = useScannerWizardContext();
	const { error } = useToastNotification();
	const { copied, copyToClipboard } = useCopyToClipboard();
	const { markResolved } = useManualFixForm({
		item,
		current,
	});

	const [openExample, setOpenExample] = useState(false);

	const closeExample = () => setOpenExample(false);
	const handleLinkClick = (e) => {
		e.preventDefault();
		setOpenExample(true);
	};

	const sendMixpanelEvent = (event) => {
		mixpanelService.sendEvent(event, {
			category_name: openedBlock,
			issue_type: item.message,
			element_selector: item.path.dom,
		});
	};

	const focusOnActive = () => {
		const rootNode = document.getElementById('ea11y-scanner-wizard-widget');
		const currentItem = rootNode.shadowRoot.querySelector(
			`#manual-panel-${current}`,
		);

		if (currentItem) {
			currentItem.focus();
		}
	};

	const handleSkip = () => {
		closeExample();
		setOpen(current + 1);
		focusOnActive();

		sendMixpanelEvent(mixpanelEvents.issueSkipped);

		speak(__('Issue skipped', 'pojo-accessibility'), 'polite');
	};

	const handleMarkResolved = async () => {
		try {
			await APIScanner.resolveIssue(currentScanId);

			closeExample();
			markResolved();
			focusOnActive();

			sendMixpanelEvent(mixpanelEvents.markAsResolveClicked);

			speak(__('Issue resolved', 'pojo-accessibility'), 'polite');
		} catch (e) {
			error(__('An error occurred.', 'pojo-accessibility'));
		}
	};

	const showAIBlock =
		openedBlock !== BLOCKS.colorContrast &&
		!EXCLUDE_FROM_AI.includes(item.ruleId);

	return (
		<>
			<StyledAccordionDetails>
				<Box>
					<Box display="flex" gap={1} alignItems="center">
						<Typography variant="subtitle2" as="h5">
							{__('What’s the issue', 'pojo-accessibility')}
						</Typography>

						<Infotip
							tabIndex="0"
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
										{uxMessaging[item.ruleId].whyItMatters}
									</Typography>
								</InfotipBox>
							}
						>
							<InfoCircleIcon fontSize="small" color="action" />
						</Infotip>
					</Box>

					<Typography variant="body2">
						{uxMessaging[item.ruleId]?.whatsTheIssue ?? item.message}
					</Typography>
				</Box>

				<Box>
					<TitleBox>
						<Typography variant="subtitle2" as="h5" sx={{ mb: 0.5 }}>
							{__('Where is it', 'pojo-accessibility')}
						</Typography>
						<Tooltip
							arrow
							placement="top"
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
									item.snippet,
									'error_snippet',
									'assistant',
								)}
							>
								<CopyIcon fontSize="tiny" />
							</IconButton>
						</Tooltip>
					</TitleBox>

					<StyledAlert color="error" icon={false}>
						<Box display="flex" gap={0.5} alignItems="start">
							<StyledSnippet variant="body2">{item.snippet}</StyledSnippet>
						</Box>
					</StyledAlert>
				</Box>

				{showAIBlock && <ResolveWithAi current={current} item={item} />}

				{uxMessaging[item.ruleId] && (
					<>
						<Box>
							<Typography variant="subtitle2" as="h5">
								{__('How to resolve it', 'pojo-accessibility')}
							</Typography>

							<Typography variant="body2">
								{uxMessaging[item.ruleId].howToResolve}

								<Infotip
									arrow
									placement="left"
									onClose={closeExample}
									open={openExample}
									PopperProps={{
										disablePortal: true,
									}}
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
												<Typography variant="subtitle1" as="h5" sx={{ mb: 3 }}>
													{__('See an example', 'pojo-accessibility')}
												</Typography>

												<IconButton
													onClick={closeExample}
													aria-label={__('Close tooltip', 'pojo-accessibility')}
													size="small"
													edge="end"
													sx={{ mt: -1 }}
												>
													<XIcon />
												</IconButton>
											</Box>

											<Typography variant="subtitle2" as="h6">
												{__('Issue:', 'pojo-accessibility')}
											</Typography>

											<Typography
												variant="body2"
												color="secondary"
												sx={{ mb: 2 }}
											>
												{uxMessaging[item.ruleId].seeAnExample.issue}
											</Typography>

											<Typography variant="subtitle2" as="h6">
												{__('Resolution:', 'pojo-accessibility')}
											</Typography>

											{uxMessaging[item.ruleId].seeAnExample.resolution.flatMap(
												(resolution, index) => (
													<Typography
														variant="body2"
														color="secondary"
														key={`resolution-${index}`}
														sx={{ mb: 2 }}
													>
														{resolution}
													</Typography>
												),
											)}

											<InfotipFooter>
												<Button
													size="small"
													color="info"
													variant="contained"
													onClick={closeExample}
												>
													{__('Got it', 'pojo-accessibility')}
												</Button>
											</InfotipFooter>
										</InfotipBox>
									}
								>
									<Link
										underline="none"
										color="info.main"
										onClick={handleLinkClick}
										sx={{ mx: 0.5 }}
									>
										{__('See an example', 'pojo-accessibility')}
									</Link>
								</Infotip>
							</Typography>
						</Box>
					</>
				)}
			</StyledAccordionDetails>
			<AccordionActions sx={{ py: 3 }}>
				<Button
					size="small"
					color="secondary"
					variant="text"
					onClick={handleSkip}
				>
					{__('Skip for now', 'pojo-accessibility')}
				</Button>
				<Button
					size="small"
					color="info"
					variant="outlined"
					onClick={handleMarkResolved}
					startIcon={<CheckIcon />}
				>
					{__('Mark as resolved', 'pojo-accessibility')}
				</Button>
			</AccordionActions>
		</>
	);
};

ManualFixForm.propTypes = {
	item: scannerItem,
	current: PropTypes.number.isRequired,
	setOpen: PropTypes.func.isRequired,
};
