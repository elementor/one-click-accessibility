import Menu from '@elementor/ui/Menu';
import { QuotaBarGroup } from '@ea11y/components';

export const QuotaPopupMenu = (menuProps) => {
	return (
		<Menu
			{...menuProps}
			anchorOrigin={{
				vertical: 'bottom',
				horizontal: 'right',
			}}
			transformOrigin={{
				vertical: 'top',
				horizontal: 'left',
			}}
			/* eslint-disable-next-line jsx-a11y/no-autofocus */
			autoFocus={false}
		>
			<QuotaBarGroup collapsible={false} popup={true} />
		</Menu>
	);
};

export default QuotaPopupMenu;
