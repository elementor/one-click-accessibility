import TablePagination from '@elementor/ui/TablePagination';
import { __ } from '@wordpress/i18n';
import { useAccessibilityAssistantContext } from '../../../contexts/accessibility-assistant-context';

const AccessibilityAssistantResultsPagination = () => {
	const {
		scannerResults,
		page,
		setPage,
		setRowsPerPage,
		rowsPerPage,
		loading,
	} = useAccessibilityAssistantContext();

	if (loading) {
		return null;
	}

	const onRowsPerPageChange = (event) => {
		setRowsPerPage(event.target.value);
	};

	const onPageChange = (event, newPage) => {
		setPage(newPage);
	};

	return (
		<TablePagination
			count={scannerResults.length}
			page={page}
			onPageChange={onPageChange}
			rowsPerPage={rowsPerPage}
			labelRowsPerPage={__('Scanned URLs per page:', 'pojo-accessibility')}
			onRowsPerPageChange={onRowsPerPageChange}
			colSpan={6}
			align="right"
		/>
	);
};

export default AccessibilityAssistantResultsPagination;
