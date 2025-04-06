import { Badge } from '@elementor/ui';
import Box from '@elementor/ui/Box';
import Button from '@elementor/ui/Button';
import Typography from '@elementor/ui/Typography';
import PropTypes from 'prop-types';
import { useScannerWizardContext } from '@ea11y-apps/scanner/context/scanner-wizard-context';

export const BlockButton = ({ title, count, block }) => {
	const { setOpenedBlock } = useScannerWizardContext();

	const handleClick = () => {
		setOpenedBlock(block);
	};

	return (
		<Button
			variant="outlined"
			color="secondary"
			size="large"
			fullWidth
			sx={{ justifyContent: 'start', p: 1.5 }}
			onClick={handleClick}
		>
			<Box display="flex" gap={1}>
				<Typography variant="subtitle2">{title}</Typography>
				<Badge
					badgeContent={count}
					color="secondary"
					variant="standard"
					anchorOrigin={{
						vertical: 'top',
						horizontal: 'center', // center horizontally
					}}
					sx={{ top: '-1px' }}
				/>
			</Box>
		</Button>
	);
};

BlockButton.propTypes = {
	title: PropTypes.string.isRequired,
	count: PropTypes.number.isRequired,
	block: PropTypes.string.isRequired,
};
