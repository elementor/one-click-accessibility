import Box from '@elementor/ui/Box';
import Divider from '@elementor/ui/Divider';
import Pagination from '@elementor/ui/Pagination';
import { styled } from '@elementor/ui/styles';
import PropTypes from 'prop-types';
import { mixpanelEvents, mixpanelService } from '@ea11y-apps/global/services';
import { useScannerWizardContext } from '@ea11y-apps/scanner/context/scanner-wizard-context';

export const FormNavigation = ({ total, current, setCurrent }) => {
	const { openedBlock } = useScannerWizardContext();
	const onChange = (event, index) => {
		setCurrent(index - 1);
		mixpanelService.sendEvent(mixpanelEvents.navigationChanged, {
			page: index,
			category: openedBlock,
		});
	};
	return (
		<Box sx={{ minHeight: '65px' }}>
			<StyledNavigationContainer>
				<Divider />
				<StyledBox>
					<StyledNavigation>
						<Pagination count={total} page={current + 1} onChange={onChange} />
					</StyledNavigation>
				</StyledBox>
			</StyledNavigationContainer>
		</Box>
	);
};

const StyledNavigationContainer = styled(Box)`
	position: fixed;
	bottom: 0;
	right: ${({ theme }) => theme.spacing(2)};
	width: 393px;
	background: ${({ theme }) => theme.palette.background.paper};
`;
const StyledBox = styled(Box)`
	display: flex;
	justify-content: center;
	padding-block: ${({ theme }) => theme.spacing(2)};
`;

const StyledNavigation = styled(Box)`
	display: flex;
	justify-content: space-between;
	align-items: center;
	gap: ${({ theme }) => theme.spacing(2)};
`;

FormNavigation.propTypes = {
	total: PropTypes.number.isRequired,
	current: PropTypes.number.isRequired,
	setCurrent: PropTypes.func.isRequired,
};
