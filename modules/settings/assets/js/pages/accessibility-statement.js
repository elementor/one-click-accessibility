import ChevronLeftIcon from '@elementor/icons/ChevronLeftIcon';
import Box from '@elementor/ui/Box';
import FormControl from '@elementor/ui/FormControl';
import FormLabel from '@elementor/ui/FormLabel';
import Link from '@elementor/ui/Link';
import Radio from '@elementor/ui/Radio';
import RadioGroup from '@elementor/ui/RadioGroup';
import Typography from '@elementor/ui/Typography';
import { StatementGenerator } from '@ea11y/components';
import Button from '@ea11y/components/button';
import { useModal, useSettings } from '@ea11y/hooks';
import {
	AccessibilityStatementCreateIcon,
	AccessibilityStatementExistingIcon,
} from '@ea11y/icons';
import { StatementLink } from '@ea11y/layouts';
import {
	StyledBox,
	StyledStatementPaper,
	StyledTitle,
	StyledWideBox,
} from '@ea11y/pages/pages.styles';
import { GOLINKS } from '@ea11y-apps/global/constants';
import { mixpanelEvents, mixpanelService } from '@ea11y-apps/global/services';
import { injectTemplateVars } from '@ea11y-apps/global/utils/inject-template-vars';
import { useEffect, useState } from '@wordpress/element';
import { __ } from '@wordpress/i18n';

const AccessibilityStatement = () => {
	const { accessibilityStatementData } = useSettings();
	const { isOpen, open, close } = useModal(false);
	const [continueDisabled, setContinueDisabled] = useState(true);
	// Store statement option - generate or existing
	const [statementOption, setStatementOption] = useState('');
	const [showStatementLink, setShowStatementLink] = useState(false);

	useEffect(() => {
		mixpanelService.sendEvent(mixpanelEvents.pageView, {
			page: 'Accessibility statement',
		});
	}, []);

	useEffect(() => {
		setContinueDisabled(false);
	}, [statementOption]);

	useEffect(() => {
		setContinueDisabled(true);
	}, []);

	const onStatementOptionClick = (option) => () => {
		setStatementOption(option);
		mixpanelService.sendEvent(mixpanelEvents.statementFlowSelected, {
			flowType: option,
		});
	};

	const handleContinue = () => {
		if (statementOption === 'generate') {
			open();
			setContinueDisabled(true);
		} else if (statementOption === 'existing') {
			setShowStatementLink(true);
		}
	};

	/**
	 * Go back to the statement option section.
	 */
	const handleBackButton = () => {
		setContinueDisabled(false);
		setShowStatementLink(false);
	};

	return (
		<>
			<StyledBox>
				<StyledWideBox>
					<StyledTitle variant="h4" color="text.primary" sx={{ mb: 0 }}>
						{__('Accessibility statement', 'pojo-accessibility')}
					</StyledTitle>

					<Typography variant="body2" color="text.primary" width="60%">
						{injectTemplateVars(
							__(
								'An accessibility statement showcases your efforts to create an inclusive online space, highlighting helpful features and a commitment to accessibility. {{link}}Learn more{{/link}}',
								'pojo-accessibility',
							),
							{
								link: ({ children }) => (
									<Link
										href={GOLINKS.LEARN_MORE_STATEMENT}
										target="_blank"
										rel="noopener noreferrer"
										color="secondary"
										underline="hover"
									>
										{children}
									</Link>
								),
							},
						)}
					</Typography>

					{!accessibilityStatementData?.pageId && !showStatementLink && (
						<>
							<FormControl
								sx={{
									display: 'flex',
									justifyContent: 'center',
									width: '100%',
								}}
							>
								<FormLabel
									id="icon-select-radio-buttons-group-label"
									color="secondary"
								>
									<Typography
										variant="h6"
										color="text.primary"
										align="center"
										marginBottom="4px"
										marginTop={4}
									>
										{__(
											'Need an accessibility statement?',
											'pojo-accessibility',
										)}
									</Typography>

									<Typography
										variant="body2"
										color="text.secondary"
										marginBottom={3}
										align="center"
									>
										{__(
											'You can have a statement created for you or use what you already have.',
											'pojo-accessibility',
										)}
									</Typography>
								</FormLabel>

								<RadioGroup
									aria-labelledby="icon-select-radio-buttons-group-label"
									name="icon-select-radio-buttons-group"
									value={statementOption}
									sx={{
										display: 'flex',
										justifyContent: 'center',
										flexDirection: 'row',
										flexWrap: 'nowrap',
										gap: 5,
										width: '100%',
									}}
								>
									<StyledStatementPaper
										key="generate-accessibility-statement"
										variant="outlined"
										onClick={onStatementOptionClick('generate')}
										sx={{
											borderColor:
												statementOption === 'generate'
													? 'info.main'
													: 'divider',
											borderWidth: statementOption === 'generate' ? 2 : 1,
										}}
									>
										<AccessibilityStatementCreateIcon />

										<Typography marginTop={1}>
											{__('Yes, I need one', 'pojo-accessibility')}
										</Typography>

										<Radio
											value="generate"
											sx={{ opacity: 0, position: 'absolute' }}
										/>
									</StyledStatementPaper>

									<StyledStatementPaper
										key="existing-accessibility-statement"
										variant="outlined"
										onClick={onStatementOptionClick('existing')}
										sx={{
											borderColor:
												statementOption === 'existing'
													? 'info.main'
													: 'divider',
											borderWidth: statementOption === 'existing' ? 2 : 1,
										}}
									>
										<AccessibilityStatementExistingIcon />

										<Typography marginTop={1}>
											{__('No, I already have one', 'pojo-accessibility')}
										</Typography>

										<Radio
											value="existing"
											sx={{ opacity: 0, position: 'absolute' }}
										/>
									</StyledStatementPaper>
								</RadioGroup>
							</FormControl>
						</>
					)}

					{(accessibilityStatementData?.pageId || showStatementLink) && (
						<>
							{!accessibilityStatementData?.pageId && (
								<Button
									size="large"
									color="secondary"
									startIcon={<ChevronLeftIcon fontSize="small" />}
									onClick={handleBackButton}
								>
									{__('Back', 'pojo-accessibility')}
								</Button>
							)}
							<StatementLink />
						</>
					)}
				</StyledWideBox>

				{!accessibilityStatementData?.pageId && !showStatementLink && (
					<Box
						display="flex"
						justifyContent="end"
						p={2}
						width="100%"
						borderTop="1px solid rgba(0, 0, 0, 0.12)"
					>
						<Button
							color="info"
							variant="contained"
							disabled={continueDisabled}
							onClick={handleContinue}
							sx={{ alignSelf: 'end' }}
						>
							{__('Continue', 'pojo-accessibility')}
						</Button>
					</Box>
				)}
			</StyledBox>

			<StatementGenerator open={isOpen} close={close} />
		</>
	);
};

export default AccessibilityStatement;
