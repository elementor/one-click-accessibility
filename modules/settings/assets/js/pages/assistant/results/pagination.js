import TablePagination from '@elementor/ui/TablePagination';
import { styled } from '@elementor/ui/styles';
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
		<StyledPagination
			count={scannerResults.length}
			page={page}
			onPageChange={onPageChange}
			rowsPerPage={rowsPerPage}
			onRowsPerPageChange={onRowsPerPageChange}
			colspan="6"
			align="right"
		/>
	);
};

const StyledPagination = styled(TablePagination)``;

export default AccessibilityAssistantResultsPagination;
