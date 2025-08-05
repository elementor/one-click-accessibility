import ChevronLeftIcon from '@elementor/icons/ChevronLeftIcon';
import ChevronRightIcon from '@elementor/icons/ChevronRightIcon';
import Box from '@elementor/ui/Box';
import Divider from '@elementor/ui/Divider';
import IconButton from '@elementor/ui/IconButton';
import Typography from '@elementor/ui/Typography';
import { styled } from '@elementor/ui/styles';
import PropTypes from 'prop-types';
import { mixpanelEvents, mixpanelService } from '@ea11y-apps/global/services';
import { isRTL } from '@ea11y-apps/scanner/constants';
import { useScannerWizardContext } from '@ea11y-apps/scanner/context/scanner-wizard-context';
import { __, sprintf } from '@wordpress/i18n';

export const FormNavigation = ({ total, current, setCurrent }) => {
	const { openedBlock } = useScannerWizardContext();
	const previous = current - 1;
	const next = current + 1;
	const navigate = (index, direction) => () => {
		setCurrent(index);
		mixpanelService.sendEvent(mixpanelEvents.navigationImageClicked, {
			direction,
			category: openedBlock,
		});
	};
	return (
		<Navigation>
			<Divider />
			<StyledBox>
				<StyledNavigation>
					<StyledIconButton
						onClick={navigate(previous, 'previous')}
						disabled={current === 0}
						aria-label={__('Previous', 'pojo-accessibility')}
					>
						<ChevronLeftIcon />
					</StyledIconButton>
					<Typography variant="body1">
						{sprintf(
							// Translators: %1$s - current, %2$s - total
							__('%1$s of %2$s issues', 'pojo-accessibility'),
							current + 1,
							total,
						)}
					</Typography>
					<StyledIconButton
						onClick={navigate(next, 'next')}
						disabled={current === total - 1}
						aria-label={__('Next', 'pojo-accessibility')}
					>
						<ChevronRightIcon />
					</StyledIconButton>
				</StyledNavigation>
			</StyledBox>
		</Navigation>
	);
};

const Navigation = styled(Box)`
	position: absolute;
	bottom: 0;
	left: 0;
	width: 100%;
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

const StyledIconButton = styled(IconButton)`
	${isRTL ? 'transform: rotate(180deg)' : ''}
`;

FormNavigation.propTypes = {
	total: PropTypes.number.isRequired,
	current: PropTypes.number.isRequired,
	setCurrent: PropTypes.func.isRequired,
};
