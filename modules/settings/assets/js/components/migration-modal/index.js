import Button from '@elementor/ui/Button';
import Dialog from '@elementor/ui/Dialog';
import DialogActions from '@elementor/ui/DialogActions';
import DialogContent from '@elementor/ui/DialogContent';
import DialogHeader from '@elementor/ui/DialogHeader';
import Link from '@elementor/ui/Link';
import List from '@elementor/ui/List';
import ListItem from '@elementor/ui/ListItem';
import ListItemText from '@elementor/ui/ListItemText';
import Typography from '@elementor/ui/Typography';
import { styled } from '@elementor/ui/styles';
import { useStorage } from '@ea11y/hooks';
import { TOOL_MANAGER_URL } from '@ea11y-apps/global/constants';
import { useToastNotification } from '@ea11y-apps/global/hooks';
import { mixpanelService } from '@ea11y-apps/global/services';
import { useState } from '@wordpress/element';
import { __ } from '@wordpress/i18n';
import APISettings from '../../api';

const MigrationModal = ({ onClose }) => {
	const toast = useToastNotification();
	const { save } = useStorage();
	const [isLoading, setIsLoading] = useState(false);

	const persistDismissed = async () => {
		await save({
			ea11y_migration_popup_dismissed: true,
		});
	};

	const trackButtonClick = (
		button,
		interactionResult,
		status = null,
		error,
	) => {
		mixpanelService.oneMigration.trackButtonClicked(
			button,
			interactionResult,
			status,
			error,
		);
	};

	const handleMoveToOne = async () => {
		setIsLoading(true);
		try {
			const response = await APISettings.migrateToOne();

			if (response?.isMigrated) {
				trackButtonClick('move_to_one', 'migration_success', 'success');
				onClose();
				toast.success(
					__(
						'Web Accessibility has successfully moved to your One subscription.',
						'pojo-accessibility',
					),
				);
				setTimeout(() => {
					window.location.reload();
				}, 1500);
			} else {
				setIsLoading(false);
				trackButtonClick('move_to_one', 'migration_failed', 'failed');
				toast.error(
					__(
						'Web Accessibility could not move to your One subscription. Please try again.',
						'pojo-accessibility',
					),
				);
			}
		} catch (err) {
			setIsLoading(false);
			const errorMessage =
				err?.message ?? __('Unknown error', 'pojo-accessibility');
			trackButtonClick(
				'move_to_one',
				'migration_failed',
				'failed',
				err?.code ?? errorMessage,
			);
			toast.error(
				`${__('Web Accessibility could not move to your One subscription.', 'pojo-accessibility')} ${__('Error:', 'pojo-accessibility')} ${errorMessage}`,
			);
		}
	};

	const handleNotNow = async () => {
		trackButtonClick('not_now', 'skip_migration', null);
		await persistDismissed();
		onClose();
		toast.hint(
			<>
				{__(
					'You can always migrate your subscriptions from the',
					'pojo-accessibility',
				)}{' '}
				<Link href={TOOL_MANAGER_URL} underline="always">
					{__('Tool Manager', 'pojo-accessibility')}
				</Link>
				.
			</>,
		);
	};

	return (
		<Dialog
			open
			onClose={handleNotNow}
			maxWidth="sm"
			fullWidth
			aria-labelledby="migration-dialog-title"
		>
			<StyledDialogHeader logo={false}>
				<StyledTitle
					variant="subtitle1"
					component="h2"
					fontWeight={600}
					id="migration-dialog-title"
				>
					{__('Move Web Accessibility to Elementor One', 'pojo-accessibility')}
				</StyledTitle>
			</StyledDialogHeader>

			<DialogContent>
				<Typography variant="body2" color="text.secondary" marginBlockEnd={2}>
					{__(
						'Web Accessibility is currently active with its own subscription. You also have an Elementor One subscription for this site.',
						'pojo-accessibility',
					)}
				</Typography>

				<Typography variant="body2" color="text.secondary" marginBlockEnd={1}>
					{__('If you switch to Elementor One:', 'pojo-accessibility')}
				</Typography>

				<StyledList dense disablePadding>
					<StyledListItem disableGutters>
						<StyledListItemText
							primary={__(
								'Your current Web Accessibility subscription will be deactivated',
								'pojo-accessibility',
							)}
						/>
					</StyledListItem>
					<StyledListItem disableGutters>
						<StyledListItemText
							primary={__(
								'Web Accessibility will use your shared Elementor One credits',
								'pojo-accessibility',
							)}
						/>
					</StyledListItem>
				</StyledList>
			</DialogContent>

			<StyledDialogActions>
				<Button
					color="secondary"
					variant="outlined"
					onClick={handleNotNow}
					disabled={isLoading}
				>
					{__('Not now', 'pojo-accessibility')}
				</Button>
				<Button
					variant="contained"
					onClick={handleMoveToOne}
					disabled={isLoading}
				>
					{__('Move to One', 'pojo-accessibility')}
				</Button>
			</StyledDialogActions>
		</Dialog>
	);
};

const StyledDialogHeader = styled(DialogHeader)`
	position: relative;

	> div {
		padding: ${({ theme }) => `
			${theme.spacing(2)} 
			${theme.spacing(4.5)}
			${theme.spacing(2)}
			${theme.spacing(2.75)}
		`};
		min-height: auto;
	}
`;

const StyledTitle = styled(Typography)`
	line-height: 1.5;
`;

const StyledList = styled(List)`
	padding-inline-start: ${({ theme }) => theme.spacing(2)};
	list-style-type: disc;
`;

const StyledListItem = styled(ListItem)`
	padding-block: 0;
	min-height: auto;
`;

const StyledListItemText = styled(ListItemText)`
	display: list-item;
	color: ${({ theme }) => theme.palette.text.secondary};
	margin: 0;
`;

const StyledDialogActions = styled(DialogActions)`
	padding: ${({ theme }) => theme.spacing(2, 3)};
`;

export default MigrationModal;
