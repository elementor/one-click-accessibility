import Box from '@elementor/ui/Box';
import Button from '@elementor/ui/Button';
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
import { useSettings, useStorage, useToastNotification } from '@ea11y/hooks';
import { useState, useEffect } from '@wordpress/element';
import { __ } from '@wordpress/i18n';
import API from '../../api';
import { Statement } from '../../helpers/accessibility-statement';
import {
	parseContent,
	checkEmail,
	checkDomain,
	checkCompanyName,
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
	const [isValidName, setValidName] = useState(null);
	const [isValidEmail, setValidEmail] = useState(null);
	const [isValidDomain, setValidDomain] = useState(null);
	const [disableCreateButton, setDisabledCreateButton] = useState(true);
	const { success, error } = useToastNotification();

	const { companyData, setCompanyData, setAccessibilityStatementData } =
		useSettings();
	const { save } = useStorage();

	useEffect(() => {
		if (checkEmail(companyData?.company_email)) {
			setValidEmail(true);
		} else {
			setValidEmail(false);
		}

		if (checkCompanyName(companyData?.company_name)) {
			setValidName(true);
		} else {
			setValidName(false);
		}

		if (checkDomain(companyData?.company_website)) {
			setValidDomain(true);
		} else {
			setValidDomain(false);
		}
	}, [companyData]);

	useEffect(() => {
		if (!isValidEmail || !isValidName || !isValidDomain) {
			setDisabledCreateButton(true);
		} else {
			setDisabledCreateButton(false);
		}
	}, [isValidName, isValidEmail, isValidDomain]);

	const handleClose = () => {
		close();
	};

	const updateCompanyData = (key, value) => {
		setCompanyData((prevData) => ({
			...prevData,
			[key]: value,
		}));
	};

	const createPage = async () => {
		const parsedContent = parseContent(Statement, companyData);
		try {
			const response = await API.addPage({
				title: 'Accessibility statement',
				content: parsedContent,
				status: 'publish',
			});
			await setAccessibilityStatementData({
				statement: parsedContent,
				pageId: response.id,
				createdOn: response.date,
				link: response.link,
			});
			await save({
				ea11y_accessibility_statement_data: {
					statement: parsedContent,
					pageId: response.id,
					createdOn: response.date,
					link: response.link,
				},
			});
			// Update accessibility statement URL in the global object.
			if (window?.ea11yWidget) {
				window.ea11yWidget.accessibilityStatementURL = response.link;
			}
			await close();
			await success('Page created');
		} catch (e) {
			error('Error while creating page');
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
								<FormLabel>
									{__('Company name', 'pojo-accessibility')}
								</FormLabel>
								<StyledTextField
									type="text"
									variant="outlined"
									size="small"
									color="secondary"
									margin="normal"
									value={companyData.company_name}
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
								<FormLabel>
									{__('Company website', 'pojo-accessibility')}
								</FormLabel>
								<StyledTextField
									type="text"
									variant="outlined"
									size="small"
									color="secondary"
									margin="normal"
									value={companyData.company_website}
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
								<FormLabel>
									{__('Business email', 'pojo-accessibility')}
								</FormLabel>
								<StyledTextField
									type="text"
									variant="outlined"
									size="small"
									color="secondary"
									margin="normal"
									value={companyData.company_email}
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
						disabled={disableCreateButton}
					>
						{__('Create statement & page', 'pojo-accessibility')}
					</Button>
				</DialogActions>
			</Dialog>
		</ErrorBoundary>
	);
};

export default StatementGenerator;
