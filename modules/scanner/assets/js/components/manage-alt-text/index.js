import EditIcon from '@elementor/icons/EditIcon';
import SettingsIcon from '@elementor/icons/SettingsIcon';
import Alert from '@elementor/ui/Alert';
import AlertTitle from '@elementor/ui/AlertTitle';
import Box from '@elementor/ui/Box';
import Divider from '@elementor/ui/Divider';
import IconButton from '@elementor/ui/IconButton';
import Tooltip from '@elementor/ui/Tooltip';
import Typography from '@elementor/ui/Typography';
import PropTypes from 'prop-types';
import { ImagePreview } from '@ea11y-apps/scanner/components/alt-text-form/image-preview';
import { ManageActions } from '@ea11y-apps/scanner/components/manage-actions';
import { StyledBox } from '@ea11y-apps/scanner/styles/app.styles';
import {
	ItemHeader,
	ItemTitle,
} from '@ea11y-apps/scanner/styles/manual-fixes.styles';
import { remediationItem } from '@ea11y-apps/scanner/types/remediation-item';
import {
	focusOnElement,
	removeExistingFocus,
} from '@ea11y-apps/scanner/utils/focus-on-element';
import { getElementByXPath } from '@ea11y-apps/scanner/utils/get-element-by-xpath';
import { useEffect } from '@wordpress/element';
import { __ } from '@wordpress/i18n';

export const ManageAltText = ({ item, current, openEdit }) => {
	const data = JSON.parse(item.content);
	const node = getElementByXPath(data.xpath);
	const isActive = Boolean(Number(item.active));

	useEffect(() => {
		void (node ? focusOnElement(node) : removeExistingFocus());
	}, [current]);

	const isDecorative =
		data.attribute_name === 'role' && data.attribute_value === 'presentation';

	return (
		<StyledBox>
			<Divider />
			<Box>
				<ItemHeader>
					<ItemTitle>
						<SettingsIcon />
						<Typography variant="subtitle2">
							{isActive
								? __('Active fix', 'pojo-accessibility')
								: __('Fix (disabled)', 'pojo-accessibility')}
						</Typography>
					</ItemTitle>

					<Box display="flex" gap={0.5}>
						<Tooltip
							placement="top"
							title={__('Edit', 'pojo-accessibility')}
							PopperProps={{
								disablePortal: true,
							}}
						>
							<IconButton size="small" onClick={openEdit}>
								<EditIcon fontSize="small" />
							</IconButton>
						</Tooltip>
					</Box>
				</ItemHeader>
				<ImagePreview element={node} />
			</Box>
			{isDecorative ? (
				<Alert color="info">
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
					<Alert color="info" icon={false}>
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
