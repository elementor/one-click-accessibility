import CircleCheckFilledIcon from '@elementor/icons/CircleCheckFilledIcon';
import Box from '@elementor/ui/Box';
import Chip from '@elementor/ui/Chip';
import Typography from '@elementor/ui/Typography';
import PropTypes from 'prop-types';
import { mixpanelEvents, mixpanelService } from '@ea11y-apps/global/services';
import { useScannerWizardContext } from '@ea11y-apps/scanner/context/scanner-wizard-context';
import {
	StyledButton,
	StyledButtonContainer,
} from '@ea11y-apps/scanner/styles/app.styles';

export const BlockButton = ({ title, count, block }) => {
	const { setOpenedBlock, isResolved } = useScannerWizardContext();

	const resolved = count === 0 || isResolved(block);

	const handleClick = () => {
		setOpenedBlock(block);
		mixpanelService.sendEvent(mixpanelEvents.categoryClicked, {
			page_url: window.ea11yScannerData?.pageData?.url,
			issue_count: count,
			category_name: title,
			source: 'assistant',
		});
	};

	return (
		<StyledButton
			variant="outlined"
			color="secondary"
			size="large"
			fullWidth
			onClick={handleClick}
		>
			<StyledButtonContainer
				elevation={0}
				variant="elevation"
				color={resolved ? 'success' : 'default'}
			>
				<Box display="flex" alignItems="center" gap={0.5}>
					<Typography variant="subtitle2" as="h4" color="text.primary">
						{title}
					</Typography>

					{!resolved && (
						<Chip label={count} color="error" variant="standard" size="tiny" />
					)}
				</Box>

				{resolved && <CircleCheckFilledIcon color="success" />}
			</StyledButtonContainer>
		</StyledButton>
	);
};

BlockButton.propTypes = {
	title: PropTypes.string.isRequired,
	count: PropTypes.number.isRequired,
	block: PropTypes.string.isRequired,
};
