import InfoCircleIcon from '@elementor/icons/InfoCircleIcon';
import Accordion from '@elementor/ui/Accordion';
import AccordionDetails from '@elementor/ui/AccordionDetails';
import AccordionSummary from '@elementor/ui/AccordionSummary';
import AccordionSummaryIcon from '@elementor/ui/AccordionSummaryIcon';
import Box from '@elementor/ui/Box';
import FormLabel from '@elementor/ui/FormLabel';
import Infotip from '@elementor/ui/Infotip';
import ListItemText from '@elementor/ui/ListItemText';
import TextField from '@elementor/ui/TextField';
import Typography from '@elementor/ui/Typography';
import { styled } from '@elementor/ui/styles';
import { useSettings } from '@ea11y/hooks';
import { mixpanelEvents, mixpanelService } from '@ea11y-apps/global/services';
import { __ } from '@wordpress/i18n';
import { validateUrl } from '../../utils';

const SitemapSettings = ({ sitemap }) => {
	const {
		widgetMenuSettings,
		setWidgetMenuSettings,
		hasChanges,
		setHasChanges,
		hasError,
		setHasError,
	} = useSettings();

	const onEditSitemap = (event) => {
		setWidgetMenuSettings({
			...widgetMenuSettings,
			sitemap: {
				enabled: true,
				url: event.target.value,
			},
		});
		const isValid = validateUrl(event.target.value);

		setHasError({
			...hasError,
			sitemap: !isValid,
		});
		setHasChanges(isValid);
	};

	const onBlur = () => {
		if (hasChanges) {
			mixpanelService.sendEvent(mixpanelEvents.fieldContentUpdated, {
				fieldName: 'sitemap-url',
				value: widgetMenuSettings.sitemap?.url,
			});
		}
	};

	return (
		<StyledAccordion>
			<StyledAccordionSummary aria-controls="panel-content" id="panel-header">
				<AccordionSummaryIcon sx={{ padding: 0 }}>
					{sitemap?.icon}
				</AccordionSummaryIcon>
				<ListItemText
					primary={sitemap?.title}
					sx={{ flexGrow: 0, marginRight: 1 }}
					id={`ea11y-sitemap-toggle`}
				/>
			</StyledAccordionSummary>
			<StyledAccordionDetails>
				<StyledBox>
					<StyledFormLabel htmlFor="sitemap-url">
						{__('Sitemap URL', 'pojo-accessibility')}

						<Infotip
							content={
								<Typography variant="body2" sx={{ p: 2 }}>
									{__(
										'You need to add a link to activate this',
										'pojo-accessibility',
									)}
								</Typography>
							}
							placement="right"
							arrow={true}
						>
							<InfoCircleIcon fontSize="small" />
						</Infotip>
					</StyledFormLabel>
					<Box sx={{ flexGrow: 1 }}>
						<StyledTextField
							id="sitemap-url"
							type="url"
							onChange={onEditSitemap}
							onBlur={onBlur}
							value={widgetMenuSettings.sitemap?.url}
							error={hasError.sitemap}
							size="small"
							variant="outlined"
						/>
						{hasError.sitemap && (
							<Typography variant="caption" color="error">
								{__('Please enter valid URL!', 'pojo-accessibility')}
							</Typography>
						)}
					</Box>
				</StyledBox>
			</StyledAccordionDetails>
		</StyledAccordion>
	);
};

const StyledAccordion = styled(Accordion)`
	border: none;
	width: 100%;
`;

const StyledAccordionSummary = styled(AccordionSummary)`
	padding: 0;
	min-height: auto;
	justify-content: left;
	&.Mui-expanded {
		min-height: auto;
	}

	& .MuiAccordionSummary-content,
	& .MuiAccordionSummary-content.Mui-expanded {
		margin: 0 !important;
		align-items: center;
		flex-grow: 0;
	}
`;

const StyledBox = styled(Box)`
	display: flex;
	gap: 16px;
	align-items: flex-start;
`;

const StyledFormLabel = styled(FormLabel)`
	display: flex;
	align-items: center;
	gap: 8px;
	white-space: nowrap;
	padding-top: 7px;
`;

const StyledTextField = styled(TextField)`
	width: 100%;
	input {
		height: 36px;
	}
`;

const StyledAccordionDetails = styled(AccordionDetails)`
	padding: 5px 45px 5px 0;
`;

export default SitemapSettings;
