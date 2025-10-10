import Button from '@elementor/ui/Button';
import Typography from '@elementor/ui/Typography';

import { BLOCKS } from '@ea11y-apps/scanner/constants';
import { useTabsContext } from '@ea11y-apps/scanner/context/tabs-context';
import { EmptyImage } from '@ea11y-apps/scanner/images';
import { StateContainer } from '@ea11y-apps/scanner/styles/app.styles';
import { __ } from '@wordpress/i18n';

export const EmptyManageMessage = () => {
	const { tabsProps } = useTabsContext();

	const handleChangeTab = (event) => {
		tabsProps.onChange(event, BLOCKS.main);
	};

	return (
		<StateContainer sx={{ px: 6 }}>
			<EmptyImage />

			<Typography variant="subtitle1" as="h3" align="center">
				{__('No fixes yet', 'pojo-accessibility')}
			</Typography>

			<Typography variant="body2" align="center" color="text.secondary">
				{__(
					'Once you start fixing issues for this page, they’ll appear here.',
					'pojo-accessibility',
				)}
			</Typography>
			<Button
				size="small"
				variant="text"
				color="info"
				onClick={handleChangeTab}
			>
				{__('Fix issues', 'pojo-accessibility')}
			</Button>
		</StateContainer>
	);
};
