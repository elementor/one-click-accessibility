import AccordionActions from '@elementor/ui/AccordionActions';
import Box from '@elementor/ui/Box';
import Button from '@elementor/ui/Button';
import Typography from '@elementor/ui/Typography';
import PropTypes from 'prop-types';
import { useManualFixForm } from '@ea11y-apps/scanner/hooks/useManualFixForm';
import { StyledAlert } from '@ea11y-apps/scanner/styles/app.styles';
import { StyledAccordionDetails } from '@ea11y-apps/scanner/styles/manual-fixes.styles';
import { scannerItem } from '@ea11y-apps/scanner/types/scanner-item';
import { __ } from '@wordpress/i18n';

export const ManualFixForm = ({ item, current, setOpen }) => {
	const { markResolved } = useManualFixForm({ item, current });

	const handleSkip = () => {
		setOpen(current + 1);
	};
	const handleMarkResolved = () => {
		markResolved();
		handleSkip();
	};

	return (
		<>
			<StyledAccordionDetails>
				<Box>
					<Typography variant="subtitle1">
						{__('What’s the issue?', 'pojo-accessibility')}
					</Typography>
					<Typography variant="body1">{item.message}</Typography>
				</Box>
				<Box>
					<Typography variant="subtitle1" sx={{ mb: 0.5 }}>
						{__('Where is it?', 'pojo-accessibility')}
					</Typography>
					<StyledAlert color="info" icon={false}>
						<Typography variant="body1">{item.snippet}</Typography>
					</StyledAlert>
				</Box>
				<Box>
					<Typography variant="subtitle1">
						{__('How to fix it:', 'pojo-accessibility')}
					</Typography>
					<Typography variant="body1">{item.message}</Typography>
				</Box>
			</StyledAccordionDetails>
			<AccordionActions>
				<Button
					size="small"
					color="secondary"
					variant="outlined"
					onClick={handleSkip}
				>
					{__('Skip for now', 'pojo-accessibility')}
				</Button>
				<Button
					size="small"
					color="info"
					variant="contained"
					onClick={handleMarkResolved}
				>
					{__('Mark as resolved', 'pojo-accessibility')}
				</Button>
			</AccordionActions>
		</>
	);
};

ManualFixForm.propTypes = {
	item: scannerItem,
	current: PropTypes.number.isRequired,
	setOpen: PropTypes.func.isRequired,
};
