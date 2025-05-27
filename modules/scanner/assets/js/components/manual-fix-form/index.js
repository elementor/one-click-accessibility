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
import { ResolveWithAi } from '@ea11y-apps/scanner/components/manual-fix-form/resolve-with-ai';
import { BLOCKS } from '@ea11y-apps/scanner/constants';
import { uxMessaging } from '@ea11y-apps/scanner/constants/ux-messaging';
import { useScannerWizardContext } from '@ea11y-apps/scanner/context/scanner-wizard-context';
import { useManualFixForm } from '@ea11y-apps/scanner/hooks/useManualFixForm';
import { StyledAlert } from '@ea11y-apps/scanner/styles/app.styles';
import {
	InfotipBox,
	InfotipFooter,
	SectionTitle,
	StyledAccordionDetails,
	StyledSnippet,
} from '@ea11y-apps/scanner/styles/manual-fixes.styles';
import { scannerItem } from '@ea11y-apps/scanner/types/scanner-item';
import { useState } from '@wordpress/element';
import { __ } from '@wordpress/i18n';

export const ManualFixForm = ({ item, current, setOpen }) => {
	const { openedBlock } = useScannerWizardContext();
	const { copied, markResolved, copyToClipboard } = useManualFixForm({
		item,
		current,
	});

	const [openExample, setOpenExample] = useState(false);

	const closeExample = () => setOpenExample(false);
	const handleLinkClick = (e) => {
		e.preventDefault();
		setOpenExample(true);
	};

	const handleSkip = () => {
		closeExample();
		setOpen(current + 1);
	};

	const handleMarkResolved = () => {
		closeExample();
		markResolved();
	};

	return (
		<>
			<StyledAccordionDetails>
				<Box>
					<Box display="flex" gap={1} alignItems="center">
						<SectionTitle variant="body1">
							{__('What’s the issue', 'pojo-accessibility')}
						</SectionTitle>
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
					<Typography variant="body1">
						{uxMessaging[item.ruleId]?.whatsTheIssue ?? item.message}
					</Typography>
				</Box>
				<Box>
					<SectionTitle variant="body1" sx={{ mb: 0.5 }}>
						{__('Where is it', 'pojo-accessibility')}
					</SectionTitle>
					<StyledAlert color="error" icon={false}>
						<Box display="flex" gap={0.5} alignItems="start">
							<StyledSnippet variant="body1">{item.snippet}</StyledSnippet>
							<Box>
								<Tooltip
									arrow
									placement="bottom"
									title={
										copied
											? __('Copied!', 'pojo-accessibility')
											: __('Copy', 'pojo-accessibility')
									}
									id="copy-icon"
									PopperProps={{
										disablePortal: true,
									}}
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
				</Box>
				{openedBlock !== BLOCKS.colorContrast && (
					<ResolveWithAi current={current} item={item} />
				)}
				{uxMessaging[item.ruleId] && (
					<>
						<Box>
							<SectionTitle variant="body1">
								{__('How to resolve it', 'pojo-accessibility')}
							</SectionTitle>
							<Typography variant="body1">
								{uxMessaging[item.ruleId].howToResolve}
								<Infotip
									arrow
									placement="left"
									onClose={closeExample}
									open={openExample}
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
													{__('See an example', 'pojo-accessibility')}
												</Typography>
												<IconButton
													onClick={closeExample}
													size="small"
													edge="end"
													sx={{ mt: -1 }}
												>
													<XIcon />
												</IconButton>
											</Box>

											<SectionTitle variant="body1">
												{__('Issue:', 'pojo-accessibility')}
											</SectionTitle>
											<Typography variant="body1" sx={{ mb: 2 }}>
												{uxMessaging[item.ruleId].seeAnExample.issue}
											</Typography>
											<SectionTitle variant="body1">
												{__('Resolution:', 'pojo-accessibility')}
											</SectionTitle>
											{uxMessaging[item.ruleId].seeAnExample.resolution.flatMap(
												(resolution, index) => (
													<Typography
														variant="body1"
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
										href="#"
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
			<AccordionActions>
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
