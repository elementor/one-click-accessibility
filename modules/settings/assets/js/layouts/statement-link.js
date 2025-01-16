import Box from '@elementor/ui/Box';
import Button from '@elementor/ui/Button';
import Card from '@elementor/ui/Card';
import CardActions from '@elementor/ui/CardActions';
import CardContent from '@elementor/ui/CardContent';
import CardHeader from '@elementor/ui/CardHeader';
import FormControl from '@elementor/ui/FormControl';
import FormControlLabel from '@elementor/ui/FormControlLabel';
import FormHelperText from '@elementor/ui/FormHelperText';
import FormLabel from '@elementor/ui/FormLabel';
import Infotip from '@elementor/ui/Infotip';
import MenuItem from '@elementor/ui/MenuItem';
import Select from '@elementor/ui/Select';
import Switch from '@elementor/ui/Switch';
import Typography from '@elementor/ui/Typography';
import {
	CopyLink,
	WidgetLoader,
	GeneratedPageInfoTipCard,
} from '@ea11y/components';
import { useSettings, useStorage, useToastNotification } from '@ea11y/hooks';
import { mixpanelService } from '@ea11y/services';
import { useEntityRecords } from '@wordpress/core-data';
import { useEffect, useState } from '@wordpress/element';
import { __ } from '@wordpress/i18n';

const StatementLink = () => {
	const [disabled, setDisabled] = useState(true);
	const [isValidPage, setIsValidPage] = useState(false);
	const {
		accessibilityStatementData,
		setAccessibilityStatementData,
		showAccessibilityGeneratedInfotip,
	} = useSettings();
	const { save } = useStorage();
	const { success, error } = useToastNotification();
	const pages = useEntityRecords('postType', 'page', { per_page: -1 });

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

	const changePage = (id) => {
		const page = pages.records.filter((record) => record.id === id);
		if (page.length > 0) {
			setAccessibilityStatementData({
				...accessibilityStatementData,
				pageId: page[0]?.id,
				link: page[0]?.link,
			});

			mixpanelService.sendEvent('Statement page selected', {
				page: page[0]?.link,
			});
		}
	};

	const onHideLink = () => {
		setAccessibilityStatementData({
			...accessibilityStatementData,
			hideLink: !accessibilityStatementData.hideLink,
		});
		mixpanelService.sendEvent('Toggle clicked', {
			toggleData: {
				state: !accessibilityStatementData.hideLink,
				type: 'Hide link',
			},
		});
	};

	const savePage = async () => {
		try {
			await save({
				ea11y_accessibility_statement_data: accessibilityStatementData,
			});
			await success('Settings saved');
			setDisabled(true);
		} catch (e) {
			error('Failed to save settings!');
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
								<Infotip
									placement="right-start"
									content={<GeneratedPageInfoTipCard />}
									disableHoverListener
									disableFocusListener
									open={showAccessibilityGeneratedInfotip}
								>
									<Select
										variant="outlined"
										onChange={(e) => changePage(e.target.value)}
										value={accessibilityStatementData?.pageId}
										error={!isValidPage}
										color="info"
										size="small"
										sx={{ minWidth: '242px' }}
									>
										{pages?.hasResolved && pages?.records.length > 0 ? (
											pages?.records.map((page) => (
												<MenuItem value={page.id} key={page.id}>
													{page.title.rendered}
												</MenuItem>
											))
										) : (
											<MenuItem value={0} key={0}>
												{__('No pages found', 'pojo-accessibility')}
											</MenuItem>
										)}
									</Select>
								</Infotip>

								{accessibilityStatementData?.link && (
									<CopyLink content={accessibilityStatementData?.link} />
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
									<Switch
										color="secondary"
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

						<Box
							id="ea11y-widget-preview--container"
							className="ea11y-statement--widget-preview"
							padding={0}
							marginTop={2}
						>
							<WidgetLoader />
						</Box>
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
