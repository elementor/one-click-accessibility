import Button from '@elementor/ui/Button';
import Container from '@elementor/ui/Container';
import FormControl from '@elementor/ui/FormControl';
import FormLabel from '@elementor/ui/FormLabel';
import Paper from '@elementor/ui/Paper';
import Radio from '@elementor/ui/Radio';
import RadioGroup from '@elementor/ui/RadioGroup';
import Typography from '@elementor/ui/Typography';
import { StatementGenerator } from '@ea11y/components';
import { useModal, useSettings } from '@ea11y/hooks';
import {
	AccessibilityStatementExistingIcon,
	AccessibilityStatementCreateIcon,
} from '@ea11y/icons';
import { StatementLink } from '@ea11y/layouts';
import { useEffect, useState } from '@wordpress/element';
import { __ } from '@wordpress/i18n';

const AccessibilityStatement = () => {
	const { isOpen, open, close } = useModal(false);
	const [continueDisabled, setContinueDisabled] = useState(true);
	// Store statement option - generate or existing
	const [statementOption, setStatementOption] = useState();
	const [showStatementLink, setShowStatementLink] = useState(false);
	const { accessibilityStatementData } = useSettings();

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
								<Typography variant="h6" marginBottom={1} color="text.primary">
									{__('Need an accessibility statement?', 'pojo-accessibility')}
								</Typography>
								<Typography
									variant="body2"
									color="text.secondary"
									marginBottom={1}
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
									gap: 2,
								}}
							>
								<Paper
									key="generate-accessibility-statement"
									variant="outlined"
									onClick={() => {
										setStatementOption('generate');
									}}
									sx={{
										borderRadius: 'md',
										boxShadow: 'sm',
										display: 'flex',
										flexDirection: 'column',
										flexGrow: 1,
										alignItems: 'center',
										justifyContent: 'center',
										gap: 1,
										p: 2,
										width: 500,
										minHeight: 169,
										borderColor:
											statementOption === 'generate' ? 'info.main' : 'divider',
										borderWidth: statementOption === 'generate' ? 2 : 1,
										cursor: 'pointer',
									}}
								>
									<AccessibilityStatementExistingIcon />
									<Typography>
										{__('Yes, I need one', 'pojo-accessibility')}
									</Typography>
									<Radio
										value="generate"
										sx={{ opacity: 0, position: 'absolute' }}
									/>
								</Paper>
								<Paper
									key="existing-accessibility-statement"
									variant="outlined"
									onClick={() => setStatementOption('existing')}
									sx={{
										borderRadius: 'md',
										boxShadow: 'sm',
										display: 'flex',
										flexDirection: 'column',
										flexGrow: 1,
										alignItems: 'center',
										justifyContent: 'center',
										gap: 1,
										p: 2,
										minWidth: 10,
										width: 500,
										minHeight: 169,
										borderColor:
											statementOption === 'existing' ? 'info.main' : 'divider',
										borderWidth: statementOption === 'existing' ? 2 : 1,
										cursor: 'pointer',
									}}
								>
									<AccessibilityStatementCreateIcon />
									<Typography>
										{__('No, I already have one', 'pojo-accessibility')}
									</Typography>
									<Radio
										value="existing"
										sx={{ opacity: 0, position: 'absolute' }}
									/>
								</Paper>
							</RadioGroup>
						</FormControl>
						<Button
							color="info"
							variant="contained"
							disabled={continueDisabled}
							onClick={handleContinue}
							sx={{ alignSelf: 'end' }}
						>
							{__('Continue', 'pojo-accessibility')}
						</Button>
					</>
				)}
				{(accessibilityStatementData?.pageId || showStatementLink) && (
					<StatementLink />
				)}
			</Container>
			<StatementGenerator open={isOpen} close={close} />
		</>
	);
};

export default AccessibilityStatement;
