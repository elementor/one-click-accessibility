import Box from '@elementor/ui/Box';
import Card from '@elementor/ui/Card';
import CardHeader from '@elementor/ui/CardHeader';
import Table from '@elementor/ui/Table';
import TableBody from '@elementor/ui/TableBody';
import TableCell from '@elementor/ui/TableCell';
import TableHead from '@elementor/ui/TableHead';
import TablePagination from '@elementor/ui/TablePagination';
import TableRow from '@elementor/ui/TableRow';
import Typography from '@elementor/ui/Typography';
import { NoData } from '@ea11y/components/analytics/components/no-data';
import { UsageTableTitle } from '@ea11y/components/analytics/components/usage-table-title';
import { StyledCardContent } from '@ea11y/pages/pages.styles';
import { useState } from '@wordpress/element';
import { __ } from '@wordpress/i18n';
import { FEATURE_MAPPER, TABLE_PER_PAGE } from '../../../constants';
import { useAnalyticsContext } from '../../../contexts/analytics-context';
import { chunkArray } from '../../../utils';

export const UsageTable = () => {
	const { stats } = useAnalyticsContext();
	const [currentPage, setCurrentPage] = useState(0);

	const tablePageData = chunkArray(stats.elements, TABLE_PER_PAGE);

	const getEventTitle = (event, value) => {
		switch (event) {
			case 'text-align':
				return value === 'left'
					? __('Left align text', 'pojo-accessibility')
					: __('Right align text', 'pojo-accessibility');
			case 'contrast':
				switch (value) {
					case 'dark':
						return __('Dark contrast', 'pojo-accessibility');
					case 'light':
						return __('Light contrast', 'pojo-accessibility');
					default:
						return __('High contrast', 'pojo-accessibility');
				}
			case 'screen-reader':
				switch (value) {
					case 'read-normal':
						return __('Screen reader', 'pojo-accessibility');
					case 'read-fast':
						return __('Screen reader fast', 'pojo-accessibility');
					default:
						return __('Screen reader slow', 'pojo-accessibility');
				}
			default:
				return `${FEATURE_MAPPER[event].chartsTitle}${value ? ` ${value}` : ''}`;
		}
	};

	return (
		<Card variant="outlined">
			<CardHeader title={<UsageTableTitle />} />
			<StyledCardContent sx={{ minHeight: '450px' }}>
				<Table>
					<TableHead>
						<TableRow>
							<TableCell
								variant="head"
								width="40%"
								sx={
									stats.elements.length === 0 ? { borderBottom: 'none' } : null
								}
							>
								{__('Features', 'pojo-accessibility')}
							</TableCell>
							<TableCell
								variant="head"
								width="60%"
								sx={
									stats.elements.length === 0 ? { borderBottom: 'none' } : null
								}
							>
								{__('Times used', 'pojo-accessibility')}
							</TableCell>
						</TableRow>
					</TableHead>
					<TableBody>
						{tablePageData[currentPage]?.map((element, index) => (
							<TableRow
								key={`feature-${element.event}-${element.value}_${index}`}
							>
								<TableCell>
									<Box display="flex" alignItems="center" gap={1}>
										{FEATURE_MAPPER[element.event].icon}
										<Typography variant="body2">
											{getEventTitle(element.event, element.value)}
										</Typography>
									</Box>
								</TableCell>
								<TableCell>
									<Typography variant="body2">{element.total}</Typography>
								</TableCell>
							</TableRow>
						))}
					</TableBody>
				</Table>
				{tablePageData.length > 1 && (
					<Box display="flex" justifyContent="end">
						<TablePagination
							disabled={!stats.elements.length}
							count={stats.elements.length}
							onPageChange={(event, page) => setCurrentPage(page)}
							page={currentPage}
							rowsPerPage={TABLE_PER_PAGE}
							rowsPerPageOptions={[]}
							sx={{ borderBottom: 'none' }}
						/>
					</Box>
				)}
				{stats.elements.length === 0 && <NoData />}
			</StyledCardContent>
		</Card>
	);
};
