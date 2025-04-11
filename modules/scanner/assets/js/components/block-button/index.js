import { Chip } from '@elementor/ui';
import Box from '@elementor/ui/Box';
import Button from '@elementor/ui/Button';
import Typography from '@elementor/ui/Typography';
import { styled } from '@elementor/ui/styles';
import PropTypes from 'prop-types';
import { useScannerWizardContext } from '@ea11y-apps/scanner/context/scanner-wizard-context';
import { BLOCKS } from '@ea11y-apps/scanner/utils/constants';
import { __ } from '@wordpress/i18n';

export const BlockButton = ({ title, count, block }) => {
	const { setOpenedBlock } = useScannerWizardContext();

	const handleClick = () => {
		setOpenedBlock(block);
	};

	return (
		<StyledButton
			variant="outlined"
			color="secondary"
			size="large"
			fullWidth
			onClick={handleClick}
		>
			<StyledButtonContainer>
				<Box display="flex" alignItems="center" gap={0.5}>
					<Typography variant="subtitle2">{title}</Typography>
					<Chip label={count} color="error" variant="standard" size="tiny" />
				</Box>
				{block === BLOCKS.altText ? (
					<Chip
						size="small"
						color="info"
						variant="standard"
						label={__('Resolve with Ally', 'pojo-accessibility')}
					/>
				) : (
					<Chip
						size="small"
						color="secondary"
						variant="standard"
						label={__('Resolve manually', 'pojo-accessibility')}
					/>
				)}
			</StyledButtonContainer>
		</StyledButton>
	);
};

const StyledButtonContainer = styled(Box)`
	display: flex;
	justify-content: space-between;
	align-items: center;
	width: 100%;
`;

const StyledButton = styled(Button)`
	font-weight: 300;
	justify-content: start;
	padding: ${({ theme }) => theme.spacing(1.5)};
`;

BlockButton.propTypes = {
	title: PropTypes.string.isRequired,
	count: PropTypes.number.isRequired,
	block: PropTypes.string.isRequired,
};
