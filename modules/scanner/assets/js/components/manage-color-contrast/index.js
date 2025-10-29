import Box from '@elementor/ui/Box';
import Divider from '@elementor/ui/Divider';
import PropTypes from 'prop-types';
import { ColorData } from '@ea11y-apps/scanner/components/manage-color-contrast/color-data';
import ManageFooterActions from '@ea11y-apps/scanner/components/manage-footer-actions';
import { ManageItemHeader } from '@ea11y-apps/scanner/components/manage-item-header';
import { BACKGROUND_ELEMENT_CLASS } from '@ea11y-apps/scanner/constants';
import {
	ManageColorAlert,
	StyledBox,
} from '@ea11y-apps/scanner/styles/app.styles';
import { remediationItem } from '@ea11y-apps/scanner/types/remediation-item';
import {
	focusOnElement,
	removeExistingFocus,
} from '@ea11y-apps/scanner/utils/focus-on-element';
import { useEffect } from '@wordpress/element';
import { __ } from '@wordpress/i18n';

export const ManageColorContrast = ({
	item,
	node,
	color,
	background,
	current,
	openEdit,
}) => {
	useEffect(() => {
		void (node ? focusOnElement(node) : removeExistingFocus());
	}, [current]);

	useEffect(() => {
		if (background?.item) {
			focusOnElement(background?.item, BACKGROUND_ELEMENT_CLASS);
		}
	}, [background?.item]);

	const global = item.global === '1';
	const isActive = global ? item.active_for_page === '1' : item.active === '1';

	return (
		<StyledBox>
			<Divider />
			<Box>
				<ManageItemHeader
					isActive={isActive}
					openEdit={openEdit}
					global={global}
				/>
				<ManageColorAlert color={isActive ? 'info' : 'secondary'} icon={false}>
					<Box>
						{color && (
							<ColorData
								title={__('Text', 'pojo-accessibility')}
								color={color.value}
								isActive={isActive}
							/>
						)}

						{color && background && <Divider sx={{ my: 1 }} />}

						{background && (
							<ColorData
								title={__('Background', 'pojo-accessibility')}
								color={background.value}
								isActive={isActive}
							/>
						)}
					</Box>
				</ManageColorAlert>
			</Box>
			<ManageFooterActions item={item} isActive={isActive} />
		</StyledBox>
	);
};

ManageColorContrast.propTypes = {
	item: remediationItem,
	node: PropTypes.node.isRequired,
	color: PropTypes.shape({
		item: PropTypes.node,
		value: PropTypes.string,
	}),
	current: PropTypes.number.isRequired,
	openEdit: PropTypes.func.isRequired,
};
