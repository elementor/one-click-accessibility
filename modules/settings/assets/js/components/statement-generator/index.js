import Box from '@elementor/ui/Box';
import Dialog from '@elementor/ui/Dialog';
import DialogActions from '@elementor/ui/DialogActions';
import DialogContent from '@elementor/ui/DialogContent';
import DialogHeader from '@elementor/ui/DialogHeader';
import DialogTitle from '@elementor/ui/DialogTitle';
import ErrorBoundary from '@elementor/ui/ErrorBoundary';
import FormControl from '@elementor/ui/FormControl';
import FormHelperText from '@elementor/ui/FormHelperText';
import FormLabel from '@elementor/ui/FormLabel';
import TextField from '@elementor/ui/TextField';
import Typography from '@elementor/ui/Typography';
import { styled } from '@elementor/ui/styles';
import { AlertError, HtmlToTypography } from '@ea11y/components';
import Button from '@ea11y/components/button';
import { useSettings, useStorage } from '@ea11y/hooks';
import { useToastNotification } from '@ea11y-apps/global/hooks';
import { mixpanelEvents, mixpanelService } from '@ea11y-apps/global/services';
import { useState } from '@wordpress/element';
import { __ } from '@wordpress/i18n';
import APISettings from '../../api';
import { Statement } from '../../helpers/accessibility-statement';
import {
	checkCompanyName,
	checkDomain,
	checkEmail,
	parseContent,
} from '../../helpers/statement-generator';

// Customization for the WP admin global CSS.
const StyledTextField = styled(TextField)`
	width: 100%;

	.wp-admin & .MuiInputBase-input,
	& .MuiInputBase-input:focus {
		background-color: initial;
		box-shadow: none;
		border: 0;
		color: inherit;
		outline: 0;
		padding: 16.5px 14px 16.5px 14px;
		&.MuiInputBase-inputSizeSmall {
			padding: 8.5px 14px 8.5px 14px;
		}
		height: 40px;
	}
`;

const StatementGenerator = ({ open, close }) => {
	const [isValidName, setValidName] = useState(true);
	const [isValidEmail, setValidEmail] = useState(true);
	const [isValidDomain, setValidDomain] = useState(true);
	const { success, error } = useToastNotification();

	const {
		companyData,
		setCompanyData,
		setAccessibilityStatementData,
		setShowAccessibilityGeneratedInfotip,
	} = useSettings();
	const { save } = useStorage();

	const isSubmitEnabled =
		companyData.company_name &&
		companyData.company_website &&
		companyData.company_email &&
		isValidEmail &&
		isValidName &&
		isValidDomain;

	const handleClose = () => {
		close();
	};

	const validateForm = (key, value) => {
		switch (key) {
			case 'company_website':
				setValidDomain(checkDomain(value));
				break;
			case 'company_name':
				setValidName(checkCompanyName(value));
				break;
			case 'company_email':
				setValidEmail(checkEmail(value));
				break;
			default:
				break;
		}
	};

	const updateCompanyData = (key, value) => {
		const data = {
			...companyData,
			[key]: value,
		};
		setCompanyData(data);
		validateForm(key, value);
	};

	const createPage = async () => {
		const parsedContent = parseContent(Statement, companyData);
		try {
			const response = await APISettings.addPage({
				title: 'Accessibility statement',
				content: parsedContent,
				status: 'publish',
			});
			await setAccessibilityStatementData({
				statement: parsedContent,
				pageId: response.id,
				id: response.id,
				label: 'Accessibility statement',
				createdOn: response.date,
				link: response.link,
			});
			await setShowAccessibilityGeneratedInfotip(true);
			await save({
				ea11y_accessibility_statement_data: {
					statement: parsedContent,
					pageId: response.id,
					id: response.id,
					createdOn: response.date,
					link: response.link,
					label: 'Accessibility statement',
				},
				ea11y_show_accessibility_generated_page_infotip: true,
			});
			// Update accessibility statement URL in the global object.
			if (window?.ea11yWidget) {
				window.ea11yWidget.accessibilityStatementURL = response.link;
			}
			await close();
			await success('Page created', 'pojo-accessibility');

			mixpanelService.sendEvent(mixpanelEvents.statementPageCreated);
		} catch (e) {
			error('Error while creating page', 'pojo-accessibility');
			console.error(e);
		}
	};

	return (
		<ErrorBoundary fallback={<AlertError />}>
			<Dialog
				open={open}
				onClose={handleClose}
				aria-labelledby="alert-dialog-title"
				aria-describedby="alert-dialog-description"
				fullWidth
				maxWidth="lg"
				sx={{ zIndex: 99999 }}
			>
				<DialogHeader onClose={handleClose}>
					<DialogTitle>
						{__('Statement generator', 'pojo-accessibility')}
					</DialogTitle>
				</DialogHeader>

				<DialogContent dividers>
					<Box display="grid" gridTemplateColumns="repeat(2, 1fr)" gap={8}>
						<Box>
							<Typography variant="subtitle1" color="text.primary">
								{__('Enter your company info', 'pojo-accessibility')}
							</Typography>

							<Typography
								variant="body2"
								color="text.secondary"
								marginBottom={3}
							>
								{__(
									'This will generate an accessibility statement that you can preview on the right.',
									'pojo-accessibility',
								)}
							</Typography>

							<FormControl fullWidth>
								<FormLabel htmlFor="ea11y-statement-generator-company-name">
									{__('Company name', 'pojo-accessibility')}
								</FormLabel>

								<StyledTextField
									type="text"
									id="ea11y-statement-generator-company-name"
									variant="outlined"
									size="small"
									color="secondary"
									margin="normal"
									value={companyData.company_name}
									placeholder="Acme Inc."
									onChange={(e) =>
										updateCompanyData('company_name', e.currentTarget.value)
									}
									error={isValidName === false}
								/>

								{!isValidName && (
									<FormHelperText>
										{__('Company name cannot be empty', 'pojo-accessibility')}
									</FormHelperText>
								)}
							</FormControl>

							<FormControl fullWidth>
								<FormLabel htmlFor="ea11y-statement-generator-company-website">
									{__('Company website', 'pojo-accessibility')}
								</FormLabel>

								<StyledTextField
									type="text"
									id="ea11y-statement-generator-company-website"
									variant="outlined"
									size="small"
									color="secondary"
									margin="normal"
									value={companyData.company_website}
									placeholder="https://www.acme.com/"
									onChange={(e) =>
										updateCompanyData('company_website', e.currentTarget.value)
									}
									error={isValidDomain === false}
								/>

								{!isValidDomain && (
									<FormHelperText>
										{__('Please enter a valid domain', 'pojo-accessibility')}
									</FormHelperText>
								)}
							</FormControl>

							<FormControl fullWidth>
								<FormLabel htmlFor="ea11y-statement-generator-business-website">
									{__('Business email', 'pojo-accessibility')}
								</FormLabel>

								<StyledTextField
									type="text"
									id="ea11y-statement-generator-business-website"
									variant="outlined"
									size="small"
									color="secondary"
									margin="normal"
									value={companyData.company_email}
									placeholder="contact@acme.com"
									onChange={(e) =>
										updateCompanyData('company_email', e.currentTarget.value)
									}
									error={isValidEmail === false}
								/>

								{!isValidEmail && (
									<FormHelperText>
										{__('Please enter a valid email', 'pojo-accessibility')}
									</FormHelperText>
								)}
							</FormControl>
						</Box>

						<Box>
							<Typography
								variant="subtitle1"
								color="text.primary"
								marginBottom={6}
							>
								{__(
									'Preview your accessibility statement',
									'pojo-accessibility',
								)}
							</Typography>

							<Box
								border={1}
								borderColor="divider"
								borderRadius={1}
								padding={2}
							>
								<HtmlToTypography
									htmlString={Statement}
									replacements={companyData}
								/>
							</Box>
						</Box>
					</Box>
				</DialogContent>

				<DialogActions>
					<Button onClick={handleClose} color="secondary">
						{__('Cancel', 'pojo-accessibility')}
					</Button>

					<Button
						onClick={createPage}
						variant="contained"
						color="info"
						disabled={!isSubmitEnabled}
					>
						{__('Create statement & page', 'pojo-accessibility')}
					</Button>
				</DialogActions>
			</Dialog>
		</ErrorBoundary>
	);
};

export default StatementGenerator;
