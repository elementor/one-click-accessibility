import Box from '@elementor/ui/Box';
import Button from '@elementor/ui/Button';
import Container from '@elementor/ui/Container';
import FormControl from '@elementor/ui/FormControl';
import FormLabel from '@elementor/ui/FormLabel';
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
import { useEffect, useState } from '@wordpress/element';
import { __ } from '@wordpress/i18n';

const StyledPaper = styled(Paper)`
	display: flex;
	flex-direction: column;
	flex-grow: 8px;
	align-items: center;
	justify-content: center;
	padding: 24px;
	width: 500px;
	min-height: 169px;
	border-radius: ${({ theme }) => theme.shape.borderRadius};
	box-shadow: ${({ theme }) => theme.shadows[0]};
	cursor: pointer;
	:hover {
		box-shadow: 0px 0px 15px 0px rgba(37, 99, 235, 0.15);
		border-color: ${({ theme }) => theme.palette.info.main};
	}
`;

const AccessibilityStatement = () => {
	const { accessibilityStatementData } = useSettings();
	const { isOpen, open, close } = useModal(false);
	const [continueDisabled, setContinueDisabled] = useState(true);
	// Store statement option - generate or existing
	const [statementOption, setStatementOption] = useState('');
	const [showStatementLink, setShowStatementLink] = useState(false);

	useEffect(() => {
		setContinueDisabled(false);
	}, [statementOption]);

	useEffect(() => {
		setContinueDisabled(true);
	}, []);

	const handleContinue = () => {
		if (statementOption === 'generate') {
			open();
			setContinueDisabled(true);
		} else if (statementOption === 'existing') {
			setShowStatementLink(true);
		}
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
						gap: 4,
					}}
				>
					<Typography variant="h4" color="text.primary" fontWeight="400">
						{__('Accessibility statement', 'pojo-accessibility')}
					</Typography>
					<Typography variant="body2" color="text.primary" width="60%">
						{__(
							'An accessibility statement showcases your efforts to create an inclusive online space, highlighting helpful features and a commitment to accessibility. Learn more',
							'pojo-accessibility',
						)}
					</Typography>
					{!accessibilityStatementData?.pageId && !showStatementLink && (
						<>
							<FormControl>
								<FormLabel
									id="icon-select-radio-buttons-group-label"
									color="secondary"
								>
									<Typography
										variant="h6"
										color="text.primary"
										align="center"
										marginBottom="4px"
										marginTop={3}
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
										flexDirection: 'row',
										flexWrap: 'nowrap',
										gap: 5,
									}}
								>
									<StyledPaper
										key="generate-accessibility-statement"
										variant="outlined"
										onClick={() => {
											setStatementOption('generate');
										}}
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
										onClick={() => setStatementOption('existing')}
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
						<StatementLink />
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
