import Box from '@elementor/ui/Box';
import Card from '@elementor/ui/Card';
import CardActions from '@elementor/ui/CardActions';
import CardContent from '@elementor/ui/CardContent';
import CardHeader from '@elementor/ui/CardHeader';
import FormControl from '@elementor/ui/FormControl';
import FormControlLabel from '@elementor/ui/FormControlLabel';
import FormHelperText from '@elementor/ui/FormHelperText';
import FormLabel from '@elementor/ui/FormLabel';
import Switch from '@elementor/ui/Switch';
import Typography from '@elementor/ui/Typography';
import { styled } from '@elementor/ui/styles';
import {
	CopyLink,
	EditLink,
	PageSelect,
	WidgetLoader,
} from '@ea11y/components';
import Button from '@ea11y/components/button';
import { useSettings, useStorage } from '@ea11y/hooks';
import { useToastNotification } from '@ea11y-apps/global/hooks';
import { mixpanelEvents, mixpanelService } from '@ea11y-apps/global/services';
import { useEffect, useState } from '@wordpress/element';
import { __ } from '@wordpress/i18n';
import { WIDGET_PREVIEW_ID } from '../../constants';
import WidgetPreviewSkeleton from './preview-skeleton';

const StyledPreviewContainer = styled(Box)`
	margin-top: ${({ theme }) => theme.spacing(2)};

	border-radius: 4px;
	border: 1px solid ${({ theme }) => theme.palette.divider};

	height: 250px;
	position: relative;
	padding: 25px;
	overflow: hidden;

	& .ea11y-widget-container {
		transform: translateY(0);
	}

	& .ea11y-widget-container--preview {
		position: absolute;
	}

	& .ea11y-widget-content::after {
		content: '';

		position: absolute;
		top: 0;
		right: 0;
		left: 0;
		bottom: 40px;

		background-color: #fcfdff;
		opacity: 0.6;
	}

	@media screen and (min-width: 480px) {
		& .ea11y-widget-container--preview {
			bottom: 0;
			right: 0;
		}
	}
`;

const StyledSwitch = styled(Switch)`
	input {
		height: 56px !important;
	}
`;

const StatementLink = () => {
	const [disabled, setDisabled] = useState(true);
	const [isValidPage, setIsValidPage] = useState(false);
	const { accessibilityStatementData, setAccessibilityStatementData } =
		useSettings();
	const { save } = useStorage();
	const { success, error } = useToastNotification();
	const [isWidgetLoaded, setIsWidgetLoaded] = useState(false);

	useEffect(() => {
		if (window?.ea11yWidget) {
			if (accessibilityStatementData.hideLink) {
				window.ea11yWidget.accessibilityStatementURL = null;
			} else {
				window.ea11yWidget.accessibilityStatementURL =
					accessibilityStatementData?.link;
			}
		}
		window?.ea11yWidget?.widget?.updateState();
	}, [accessibilityStatementData?.hideLink, accessibilityStatementData?.link]);

	useEffect(() => {
		// Enable button when data is changed
		setDisabled(false);
		if (!accessibilityStatementData?.link) {
			setDisabled(true);
			setIsValidPage(false);
		} else {
			setIsValidPage(true);
		}
	}, [accessibilityStatementData]);

	useEffect(() => {
		// Disable button on load
		setDisabled(true);
	}, []);

	const onHideLink = () => {
		setAccessibilityStatementData({
			...accessibilityStatementData,
			hideLink: !accessibilityStatementData.hideLink,
		});
		mixpanelService.sendEvent(mixpanelEvents.toggleClicked, {
			state: accessibilityStatementData.hideLink ? 'on' : 'off',
			type: 'Hide link',
		});
	};

	const savePage = async () => {
		try {
			await save({
				ea11y_accessibility_statement_data: accessibilityStatementData,
			});

			await success('Changes saved', 'pojo-accessibility');

			setDisabled(true);
		} catch (e) {
			error('Failed to save settings!', 'pojo-accessibility');

			console.error(e);
		}
	};

	return (
		<Card elevation={0} variant="outlined" sx={{ marginTop: 1, width: '100%' }}>
			<CardHeader
				title={__('Statement link', 'pojo-accessibility')}
				subheader={__(
					'Link your accessibility statement page to your accessibility widget.',
					'pojo-accessibility',
				)}
				sx={{ borderBottom: '1px solid', borderBottomColor: 'divider' }}
			/>

			<CardContent>
				<Box display="grid" gridTemplateColumns="repeat(2, 1fr)" gap={5}>
					<Box display="flex" flexDirection="column">
						<FormControl fullWidth sx={{ marginBottom: 2 }}>
							<FormLabel sx={{ marginBottom: 1 }}>
								<Typography variant="subtitle2" color="text.primary">
									{__('Choose which page to link', 'pojo-accessibility')}
								</Typography>
							</FormLabel>

							<Box
								display="flex"
								flexDirection="row"
								fullWidth
								alignItems="center"
							>
								<PageSelect />

								{accessibilityStatementData?.link && (
									<>
										<EditLink />
										<CopyLink content={accessibilityStatementData?.link} />
									</>
								)}
							</Box>

							{!isValidPage && (
								<FormHelperText>
									{__('Please select a page', 'pojo-accessibility')}
								</FormHelperText>
							)}
						</FormControl>

						<FormControl fullWidth>
							<FormLabel sx={{ marginBottom: 2, marginTop: 2 }}>
								<Typography variant="subtitle2" color="text.primary">
									{__('Want to hide the link?', 'pojo-accessibility')}
								</Typography>
							</FormLabel>

							<FormControlLabel
								label={__('Hide link', 'pojo-accessibility')}
								labelPlacement="start"
								control={
									<StyledSwitch
										color="info"
										size="small"
										sx={{ marginLeft: 3 }}
									/>
								}
								sx={{ marginBottom: 3, alignSelf: 'start', ml: 0 }}
								onChange={onHideLink}
								checked={accessibilityStatementData?.hideLink}
							/>
						</FormControl>
					</Box>

					<Box>
						<Typography variant="subtitle2" color="text.primary">
							{__('Preview link in widget', 'pojo-accessibility')}
						</Typography>

						<StyledPreviewContainer
							id="ea11y-widget-preview--container"
							sx={{
								padding: !isWidgetLoaded ? 0 : 'initial',
							}}
						>
							{!isWidgetLoaded && <WidgetPreviewSkeleton />}

							<WidgetLoader
								onLoad={() => {
									setIsWidgetLoaded(true);

									if (document.getElementById(WIDGET_PREVIEW_ID)) {
										window?.ea11yWidget?.widget?.open();
									}
								}}
							/>
						</StyledPreviewContainer>
					</Box>
				</Box>
			</CardContent>

			<CardActions>
				<Button
					color="info"
					variant="contained"
					onClick={savePage}
					disabled={disabled}
				>
					{__('Save changes', 'pojo-accessibility')}
				</Button>
			</CardActions>
		</Card>
	);
};

export default StatementLink;
