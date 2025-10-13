import Alert from '@elementor/ui/Alert';
import AlertTitle from '@elementor/ui/AlertTitle';
import Box from '@elementor/ui/Box';
import Divider from '@elementor/ui/Divider';
import Typography from '@elementor/ui/Typography';
import PropTypes from 'prop-types';
import { ImagePreview } from '@ea11y-apps/scanner/components/alt-text-form/image-preview';
import { ManageActions } from '@ea11y-apps/scanner/components/manage-actions';
import { ManageItemHeader } from '@ea11y-apps/scanner/components/manage-item-header';
import { StyledBox } from '@ea11y-apps/scanner/styles/app.styles';
import { remediationItem } from '@ea11y-apps/scanner/types/remediation-item';
import {
	focusOnElement,
	removeExistingFocus,
} from '@ea11y-apps/scanner/utils/focus-on-element';
import { getElementByXPath } from '@ea11y-apps/scanner/utils/get-element-by-xpath';
import { useEffect } from '@wordpress/element';
import { __ } from '@wordpress/i18n';

export const ManageAltText = ({ item, current, openEdit }) => {
	const data = JSON.parse(item?.content);
	const node = getElementByXPath(data?.xpath);
	const isActive = Boolean(Number(item?.active));

	useEffect(() => {
		void (node ? focusOnElement(node) : removeExistingFocus());
	}, [current]);

	const isDecorative =
		data.attribute_name === 'role' && data.attribute_value === 'presentation';

	return (
		<StyledBox>
			<Divider />
			<Box>
				<ManageItemHeader isActive={isActive} openEdit={openEdit} />
				<ImagePreview element={node} />
			</Box>
			{isDecorative ? (
				<Alert color={isActive ? 'info' : 'secondary'}>
					<Box>
						<AlertTitle>
							{__('Decorative image', 'pojo-accessibility')}
						</AlertTitle>
						{__(
							"(decorative images don't require descriptions)",
							'pojo-accessibility',
						)}
					</Box>
				</Alert>
			) : (
				<Box>
					<Typography variant="body2" sx={{ mb: 1 }}>
						{__('Alt text', 'pojo-accessibility')}
					</Typography>
					<Alert color={isActive ? 'info' : 'secondary'} icon={false}>
						<Box>{data.attribute_value}</Box>
					</Alert>
				</Box>
			)}
			<ManageActions item={item} isActive={isActive} />
		</StyledBox>
	);
};

ManageAltText.propTypes = {
	item: remediationItem,
	current: PropTypes.number.isRequired,
	openEdit: PropTypes.func.isRequired,
};
