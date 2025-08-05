import ReloadIcon from '@elementor/icons/ReloadIcon';
import Button from '@elementor/ui/Button';
import IconButton from '@elementor/ui/IconButton';
import { useManageActions } from '@ea11y-apps/scanner/hooks/use-manage-actions';
import { __ } from '@wordpress/i18n';

export const EnableButton = ({ group }) => {
	const { updateAllRemediationForPage } = useManageActions();
	return group ? (
		<IconButton
			size="tiny"
			color="info"
			aria-label={__('Enable all remediations', 'pojo-accessibility')}
			onClick={updateAllRemediationForPage(true, group)}
		>
			<ReloadIcon fontSize="tiny" />
		</IconButton>
	) : (
		<Button
			startIcon={<ReloadIcon />}
			size="small"
			color="info"
			variant="text"
			onClick={updateAllRemediationForPage(true)}
		>
			{__('Enable all', 'pojo-accessibility')}
		</Button>
	);
};
