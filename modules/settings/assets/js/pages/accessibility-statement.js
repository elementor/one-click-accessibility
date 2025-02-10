import { ChevronLeftIcon } from '@elementor/icons';
import Box from '@elementor/ui/Box';
import Button from '@elementor/ui/Button';
import Container from '@elementor/ui/Container';
import FormControl from '@elementor/ui/FormControl';
import FormLabel from '@elementor/ui/FormLabel';
import Link from '@elementor/ui/Link';
import Paper from '@elementor/ui/Paper';
import Radio from '@elementor/ui/Radio';
import RadioGroup from '@elementor/ui/RadioGroup';
import Typography from '@elementor/ui/Typography';
import { styled } from '@elementor/ui/styles';
import { StatementGenerator } from '@ea11y/components';
import { useModal, useSettings } from '@ea11y/hooks';
import {
	AccessibilityStatementExistingIcon,
	AccessibilityStatementCreateIcon,
} from '@ea11y/icons';
import { StatementLink } from '@ea11y/layouts';
import { mixpanelService } from '@ea11y/services';
import { useEffect, useState } from '@wordpress/element';
import { __ } from '@wordpress/i18n';
import { LEARN_MORE_LINK } from '../constants/index';
import { injectTemplateVars } from '../utils';

const StyledPaper = styled(Paper)`
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	padding: 24px;
	width: 376px;
	min-height: 264px;
	border-radius: ${({ theme }) => theme.shape.borderRadius};
	box-shadow: ${({ theme }) => theme.shadows[0]};
	cursor: pointer;

	:hover {
		box-shadow: 0 0 15px 0 rgba(37, 99, 235, 0.15);
		border-color: ${({ theme }) => theme.palette.info.main};
	}
`;

const StyledTitle = styled(Typography)`
	font-weight: 400;
	letter-spacing: 0.25px;
`;

const AccessibilityStatement = () => {
	const { accessibilityStatementData } = useSettings();
	const { isOpen, open, close } = useModal(false);
	const [continueDisabled, setContinueDisabled] = useState(true);
	// Store statement option - generate or existing
	const [statementOption, setStatementOption] = useState('');
	const [showStatementLink, setShowStatementLink] = useState(false);

	useEffect(() => {
		mixpanelService.sendEvent('page_view', {
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
		mixpanelService.sendEvent('statement_flow_selected', {
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
			<Box
				height="100%"
				display="flex"
				flexDirection="column"
				justifyContent="space-between"
			>
				<Container
					p={1}
					sx={{
						overflow: 'auto',
						maxHeight: '100%',
						padding: 4,
						display: 'flex',
						flexDirection: 'column',
						alignItems: 'start',
						gap: 2,
					}}
				>
					<StyledTitle variant="h4" color="text.primary">
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
										href={LEARN_MORE_LINK}
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
									<StyledPaper
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
									</StyledPaper>

									<StyledPaper
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
									</StyledPaper>
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
				</Container>

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
			</Box>

			<StatementGenerator open={isOpen} close={close} />
		</>
	);
};

export default AccessibilityStatement;
