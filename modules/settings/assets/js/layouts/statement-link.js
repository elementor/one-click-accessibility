import { CardActions } from '@elementor/ui';
import Box from '@elementor/ui/Box';
import Button from '@elementor/ui/Button';
import Card from '@elementor/ui/Card';
import CardContent from '@elementor/ui/CardContent';
import CardHeader from '@elementor/ui/CardHeader';
import FormControlLabel from '@elementor/ui/FormControlLabel';
import FormLabel from '@elementor/ui/FormLabel';
import MenuItem from '@elementor/ui/MenuItem';
import Select from '@elementor/ui/Select';
import Switch from '@elementor/ui/Switch';
import { useSettings, useStorage } from '@ea11y/hooks';
import { useEntityRecords } from '@wordpress/core-data';
import { __ } from '@wordpress/i18n';

const StatementLink = () => {
	const { accessibilityStatementData, setAccessibilityStatementData } =
		useSettings();
	const { save } = useStorage();
	const pages = useEntityRecords('postType', 'page', { per_page: -1 });

	const changePage = (id) => {
		const page = pages.records.filter((record) => record.id === id);
		if (page.length > 0) {
			setAccessibilityStatementData({
				...accessibilityStatementData,
				pageId: page[0]?.id,
				link: page[0]?.link,
			});
		}
	};

	const savePage = () => {
		save({ ea11y_accessibility_statement_data: accessibilityStatementData });
	};

	return (
		<Card elevation={0} variant="outlined" sx={{ marginTop: 5 }}>
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
						<FormLabel sx={{ marginBottom: 2 }}>
							{__('Choose which page to link', 'pojo-accessibility')}
						</FormLabel>
						<Select
							variant="outlined"
							onChange={(e) => changePage(e.target.value)}
							value={accessibilityStatementData?.pageId}
							sx={{ width: '200px' }}
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
						<FormLabel sx={{ marginBottom: 2, marginTop: 2 }}>
							{__('Want to hide the link?', 'pojo-accessibility')}
						</FormLabel>
						<FormControlLabel
							label={__('Hide link', 'pojo-accessibility')}
							labelPlacement="start"
							control={<Switch color="info" size="small" />}
							sx={{ marginBottom: 3, alignSelf: 'start' }}
							onChange={() => {
								setAccessibilityStatementData({
									...accessibilityStatementData,
									hideLink: !accessibilityStatementData.hideLink,
								});
							}}
							checked={accessibilityStatementData?.hideLink}
						/>
					</Box>
					<Box></Box>
				</Box>
			</CardContent>
			<CardActions>
				<Button color="info" variant="contained" onClick={savePage}>
					{__('Save changes', 'pojo-accessibility')}
				</Button>
			</CardActions>
		</Card>
	);
};

export default StatementLink;
