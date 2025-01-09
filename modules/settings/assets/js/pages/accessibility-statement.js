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
import { useState } from '@wordpress/element';
import { __ } from '@wordpress/i18n';

const AccessibilityStatement = () => {
	const { isOpen, open, close } = useModal(false);
	const [statementOption, setStatementOption] = useState();
	const { accessibilityStatementData } = useSettings();
	return (
		<>
			<Container p={1} sx={{ overflow: 'auto', maxHeight: '100%', padding: 4 }}>
				<Typography
					variant="h4"
					color="text.primary"
					fontWeight="400"
					marginBottom={2}
				>
					{__('Accessibility statement', 'pojo-accessibility')}
				</Typography>
				<Typography
					variant="body2"
					color="text.primary"
					width="60%"
					marginBottom={4}
				>
					{__(
						'An accessibility statement showcases your efforts to create an inclusive online space, highlighting helpful features and a commitment to accessibility. Learn more',
						'pojo-accessibility',
					)}
				</Typography>
				{!accessibilityStatementData?.pageId && (
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
									setStatementOption(false);
									open();
								}}
								sx={{
									borderRadius: 'md',
									boxShadow: 'sm',
									display: 'flex',
									flexDirection: 'column',
									flexGrow: 1,
									alignItems: 'center',
									justifyContent: 'center',
									gap: 1.5,
									p: 2,
									width: 329,
									minHeight: 169,
									borderColor:
										statementOption === false ? 'info.main' : 'divider',
									borderWidth: statementOption === false ? 2 : 1,
									cursor: 'pointer',
								}}
							>
								<AccessibilityStatementExistingIcon />
								<Typography>
									{__('Yes, I need one', 'pojo-accessibility')}
								</Typography>
								<Radio
									value={false}
									sx={{ opacity: 0, position: 'absolute' }}
								/>
							</Paper>
							<Paper
								key="existing-accessibility-statement"
								variant="outlined"
								onClick={() => setStatementOption(true)}
								sx={{
									borderRadius: 'md',
									boxShadow: 'sm',
									display: 'flex',
									flexDirection: 'column',
									flexGrow: 1,
									alignItems: 'center',
									justifyContent: 'center',
									gap: 1.5,
									p: 2,
									minWidth: 10,
									width: 329,
									minHeight: 169,
									borderColor:
										statementOption === true ? 'info.main' : 'divider',
									borderWidth: statementOption === true ? 2 : 1,
									cursor: 'pointer',
								}}
							>
								<AccessibilityStatementCreateIcon />
								<Typography>
									{__('No, I already have one', 'pojo-accessibility')}
								</Typography>
								<Radio value={true} sx={{ opacity: 0, position: 'absolute' }} />
							</Paper>
						</RadioGroup>
					</FormControl>
				)}
				{(!statementOption || accessibilityStatementData?.pageId) && (
					<StatementLink />
				)}
			</Container>
			<StatementGenerator open={isOpen} close={close} />
		</>
	);
};

export default AccessibilityStatement;
