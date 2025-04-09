import AIIcon from '@elementor/icons/AIIcon';
import CircleCheckFilledIcon from '@elementor/icons/CircleCheckFilledIcon';
import InfoCircleIcon from '@elementor/icons/InfoCircleIcon';
import Box from '@elementor/ui/Box';
import Button from '@elementor/ui/Button';
import Checkbox from '@elementor/ui/Checkbox';
import FormHelperText from '@elementor/ui/FormHelperText';
import IconButton from '@elementor/ui/IconButton';
import Image from '@elementor/ui/Image';
import InputAdornment from '@elementor/ui/InputAdornment';
import TextField from '@elementor/ui/TextField';
import Typography from '@elementor/ui/Typography';
import PropTypes from 'prop-types';
import {
	StyledAlert,
	StyledBox,
	StyledLabel,
	StyledPaper,
} from '@ea11y-apps/scanner/styles/alt-text-form.styles';
import { useState } from '@wordpress/element';
import { __ } from '@wordpress/i18n';

export const AltTextForm = ({ items, current }) => {
	const [data, setData] = useState([]);

	const handleCheck = (e) => {
		const updData = [...data];
		updData[current] = {
			...(data?.[current] || {}),
			makeDecorative: e.target.checked,
		};
		setData(updData);
	};

	const handleChange = (e) => {
		const updData = [...data];
		updData[current] = {
			...(data?.[current] || {}),
			altText: e.target.value,
		};
		setData(updData);
	};

	const isSubmitDisabled =
		!data?.[current]?.makeDecorative && !data?.[current]?.altText;

	return (
		<StyledBox>
			<StyledLabel>
				<Checkbox
					checked={data?.[current]?.makeDecorative ?? false}
					color="accent"
					sx={{ margin: '-7px 0 0 -10px' }}
					size="small"
					onChange={handleCheck}
				/>
				<Box>
					<Typography variant="body1">
						{__('Mark image as decorative', 'pojo-accessibility')}
					</Typography>
					<FormHelperText sx={{ mt: 0 }}>
						{__(
							"(decorative images don't need description)",
							'pojo-accessibility',
						)}
					</FormHelperText>
				</Box>
			</StyledLabel>
			<StyledPaper color="secondary" elevation={0} square>
				<Image src={items[current].node?.src} sx={{ maxHeight: '140px' }} />
			</StyledPaper>
			{!data?.[current]?.makeDecorative ? (
				<>
					<StyledAlert color="info" icon={<InfoCircleIcon color="info" />}>
						{__(
							'Short description will help those who cannot see it.',
							'pojo-accessibility',
						)}
					</StyledAlert>
					<TextField
						placeholder={__(
							'Add or generate the description here',
							'pojo-accessibility',
						)}
						color="secondary"
						value={data?.[current]?.altText ?? ''}
						onChange={handleChange}
						fullWidth
						InputProps={{
							endAdornment: (
								<InputAdornment position="end">
									<IconButton size="small">
										<AIIcon />
									</IconButton>
								</InputAdornment>
							),
						}}
					/>
				</>
			) : (
				<Box display="flex" gap={1}>
					<CircleCheckFilledIcon color="success" />
					<Typography variant="body1">
						{__('no description needed', 'pojo-accessibility')}
					</Typography>
				</Box>
			)}
			<Button
				variant="contained"
				color="info"
				fullWidth
				disabled={isSubmitDisabled}
			>
				{__('Apply', 'pojo-accessibility')}
			</Button>
		</StyledBox>
	);
};

AltTextForm.propTypes = {
	items: PropTypes.arrayOf(
		PropTypes.shape({
			ruleId: PropTypes.string.isRequired,
			value: PropTypes.arrayOf(PropTypes.number).isRequired,
			path: PropTypes.shape({
				dom: PropTypes.string.isRequired,
				aria: PropTypes.string.isRequired,
				selector: PropTypes.string.isRequired,
			}).isRequired,
			category: PropTypes.string.isRequired,
			level: PropTypes.string.isRequired,
			node: PropTypes.node,
		}),
	).isRequired,
	current: PropTypes.number.isRequired,
};
