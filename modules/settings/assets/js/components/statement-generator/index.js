import Box from '@elementor/ui/Box';
import Button from '@elementor/ui/Button';
import Dialog from '@elementor/ui/Dialog';
import DialogActions from '@elementor/ui/DialogActions';
import DialogContent from '@elementor/ui/DialogContent';
import DialogHeader from '@elementor/ui/DialogHeader';
import DialogTitle from '@elementor/ui/DialogTitle';
import ErrorBoundary from '@elementor/ui/ErrorBoundary';
import FormLabel from '@elementor/ui/FormLabel';
import TextField from '@elementor/ui/TextField';
import Typography from '@elementor/ui/Typography';
import { styled } from '@elementor/ui/styles';
import { AlertError, HtmlToTypography } from '@ea11y/components';
import { useSettings, useStorage } from '@ea11y/hooks';
import apiFetch from '@wordpress/api-fetch';
import { __ } from '@wordpress/i18n';
import { Statement } from '../../helpers/accessibility-statement';

// Customization for the WP admin global CSS.
const StyledTextField = styled(TextField)(() => ({
	width: '100%',
	'.wp-admin & .MuiInputBase-input, & .MuiInputBase-input:focus': {
		backgroundColor: 'initial',
		boxShadow: 'none',
		border: 0,
		color: 'inherit',
		outline: 0,
		padding: '16.5px 14px 16.5px 14px',
		'&.MuiInputBase-inputSizeSmall': {
			padding: '8.5px 14px 8.5px 14px',
		},
		height: '40px',
	},
}));

const StatementGenerator = ({ open, close }) => {
	const { companyData, setCompanyData, setAccessibilityStatementData } =
		useSettings();
	const { save } = useStorage();

	const handleClose = () => {
		close();
	};

	const updateCompanyData = (key, value) => {
		setCompanyData((prevData) => ({
			...prevData,
			[key]: value,
		}));
	};

	// Replace content of accessibility statement with user inputs.
	const parseContent = (text, replacements) => {
		let updatedText = text;

		// Replace each placeholder with the corresponding value from replacements
		Object.keys(replacements).forEach((key) => {
			const placeholder = `{${key}}`; // Create placeholder format (e.g., {company_name})
			const value = replacements[key]; // Get the replacement value
			updatedText = updatedText.replace(new RegExp(placeholder, 'g'), value);
		});

		return updatedText;
	};

	const createPage = async () => {
		await apiFetch({
			method: 'POST',
			path: '/wp/v2/pages',
			data: {
				title: 'Accessibility statement',
				content: parseContent(Statement, companyData),
			},
		}).then((response) => {
			console.log(response);
			setAccessibilityStatementData({
				statement: parseContent(Statement, companyData),
				pageId: response.id,
				createdOn: response.date,
			});
			save({
				ea11y_accessibility_statement_data: {
					statement: parseContent(Statement, companyData),
					pageId: response.id,
					createdOn: response.date,
				},
			});
		});
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
				<DialogHeader onClose={() => handleClose()}>
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
							<FormLabel sx={{ marginBottom: 2 }}>
								{__('Company name', 'pojo-accessibility')}
							</FormLabel>
							<StyledTextField
								type="text"
								variant="outlined"
								size="small"
								color="secondary"
								sx={{ marginRight: 1 }}
								margin="normal"
								value={companyData.company_name}
								onChange={(e) =>
									updateCompanyData('company_name', e.currentTarget.value)
								}
							/>
							<FormLabel sx={{ marginBottom: 2 }}>
								{__('Company website', 'pojo-accessibility')}
							</FormLabel>
							<StyledTextField
								type="text"
								variant="outlined"
								size="small"
								color="secondary"
								sx={{ marginRight: 1 }}
								margin="normal"
								value={companyData.company_website}
								onChange={(e) =>
									updateCompanyData('company_website', e.currentTarget.value)
								}
							/>
							<FormLabel sx={{ marginBottom: 2 }}>
								{__('Business email', 'pojo-accessibility')}
							</FormLabel>
							<StyledTextField
								type="text"
								variant="outlined"
								size="small"
								color="secondary"
								sx={{ marginRight: 1 }}
								margin="normal"
								value={companyData.company_email}
								onChange={(e) =>
									updateCompanyData('company_email', e.currentTarget.value)
								}
							/>
						</Box>
						<Box>
							<Typography
								variant="subtitle1"
								color="text.primary"
								marginBottom={3}
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
					<Button onClick={createPage} variant="contained" color="info">
						{__('Create statement & page', 'pojo-accessibility')}
					</Button>
				</DialogActions>
			</Dialog>
		</ErrorBoundary>
	);
};

export default StatementGenerator;
