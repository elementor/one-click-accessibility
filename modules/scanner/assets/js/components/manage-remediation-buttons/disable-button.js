import BanIcon from '@elementor/icons/BanIcon';
import Button from '@elementor/ui/Button';
import IconButton from '@elementor/ui/IconButton';
import { styled } from '@elementor/ui/styles';
import { useManageActions } from '@ea11y-apps/scanner/hooks/use-manage-actions';
import { __ } from '@wordpress/i18n';

export const DisableButton = ({ group }) => {
	const { updateAllRemediationForPage } = useManageActions();
	return group ? (
		<IconButton
			size="tiny"
			color="secondary"
			aria-label={__('Disable all remediations', 'pojo-accessibility')}
			onClick={updateAllRemediationForPage(false, group)}
		>
			<StyledBanIcon fontSize="tiny" />
		</IconButton>
	) : (
		<Button
			startIcon={<StyledBanIcon />}
			size="small"
			color="secondary"
			variant="text"
			onClick={updateAllRemediationForPage(false)}
		>
			{__('Disable all', 'pojo-accessibility')}
		</Button>
	);
};

const StyledBanIcon = styled(BanIcon)`
	transform: rotate(-45deg);
`;
