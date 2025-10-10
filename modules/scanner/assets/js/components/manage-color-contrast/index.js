import Box from '@elementor/ui/Box';
import Divider from '@elementor/ui/Divider';
import PropTypes from 'prop-types';
import { ManageActions } from '@ea11y-apps/scanner/components/manage-actions';
import { ColorData } from '@ea11y-apps/scanner/components/manage-color-contrast/color-data';
import { ManageItemHeader } from '@ea11y-apps/scanner/components/manage-item-header';
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

	const isActive = Boolean(Number(item?.active));

	return (
		<StyledBox>
			<Divider />
			<Box>
				<ManageItemHeader isActive={isActive} openEdit={openEdit} />
				<ManageColorAlert color={isActive ? 'info' : 'secondary'} icon={false}>
					<Box>
						{color && (
							<ColorData
								title={__('Text', 'pojo-accessibility')}
								color={color.value}
							/>
						)}

						{color && background && <Divider sx={{ my: 1 }} />}

						{background && (
							<ColorData
								title={__('Background', 'pojo-accessibility')}
								color={background.value}
							/>
						)}
					</Box>
				</ManageColorAlert>
			</Box>
			<ManageActions item={item} isActive={isActive} />
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
