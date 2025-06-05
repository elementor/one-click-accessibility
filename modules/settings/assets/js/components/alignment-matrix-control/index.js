import Box from '@elementor/ui/Box';
import FormControl from '@elementor/ui/FormControl';
import FormControlLabel from '@elementor/ui/FormControlLabel';
import FormLabel from '@elementor/ui/FormLabel';
import Paper from '@elementor/ui/Paper';
import Radio from '@elementor/ui/Radio';
import RadioGroup from '@elementor/ui/RadioGroup';
import Tooltip from '@elementor/ui/Tooltip';
import Typography from '@elementor/ui/Typography';
import { useIconPosition } from '@ea11y/hooks';
import { mixpanelEvents, mixpanelService } from '@ea11y-apps/global/services';
import { __ } from '@wordpress/i18n';

const AlignmentMatrixControl = ({ mode }) => {
	const { iconPosition, updateIconPosition } = useIconPosition();

	const handleChange = (event) => {
		updateIconPosition(mode, 'position', event.target.value);
		mixpanelService.sendEvent(mixpanelEvents.positionButtonClicked, {
			buttonData: {
				mode,
				value: event.target.value,
			},
		});
	};

	// Define options based on the mode
	const options = [
		{ value: 'top-left', label: __('Top Left', 'pojo-accessibility') },
		...(mode === 'desktop'
			? [{ value: 'top-center', label: __('Top Center', 'pojo-accessibility') }]
			: []),
		{ value: 'top-right', label: __('Top Right', 'pojo-accessibility') },
		{ value: 'center-left', label: __('Center Left', 'pojo-accessibility') },
		...(mode === 'desktop' ? [{ value: 'empty' }] : []),
		{ value: 'center-right', label: __('Center Right', 'pojo-accessibility') },
		{ value: 'bottom-left', label: __('Bottom Left', 'pojo-accessibility') },
		...(mode === 'desktop'
			? [
					{
						value: 'bottom-center',
						label: __('Bottom Center', 'pojo-accessibility'),
					},
				]
			: []),
		{ value: 'bottom-right', label: __('Bottom Right', 'pojo-accessibility') },
	];

	return (
		<FormControl>
			<FormLabel id="alignment-matrix-control" color="secondary">
				<Typography variant="subtitle2" marginBottom={3} color="text.primary">
					{__('Default Position', 'pojo-accessibility')}
				</Typography>
			</FormLabel>
			<Paper color="info" elevation={0}>
				<Box display="flex" justifyContent="center" padding={4} width="100%">
					<Paper color="secondary">
						<RadioGroup
							dir="ltr"
							aria-labelledby="alignment-matrix-control"
							value={iconPosition[mode].position}
							onChange={handleChange}
							name="alignment-matrix-control"
							sx={{
								display: 'grid',
								gridTemplateColumns:
									mode === 'desktop' ? 'repeat(3, 1fr)' : 'repeat(2, 1fr)',
								gap: 1,
								columnGap: mode === 'desktop' ? 6 : 1,
								alignItems: 'center',
								borderWidth: 5,
								borderStyle: 'solid',
								borderColor: 'secondary.main',
								borderRadius: 1,
								minWidth: mode === 'desktop' ? 'auto' : '100px',
							}}
						>
							{options.map((option) =>
								'empty' === option.value ? (
									<Box key={option.value}></Box>
								) : (
									<Tooltip title={option.label} key={option.value}>
										<FormControlLabel
											sx={{ justifyContent: 'center', margin: 0 }}
											value={option.value}
											control={<Radio color="secondary" />}
										/>
									</Tooltip>
								),
							)}
						</RadioGroup>
					</Paper>
				</Box>
			</Paper>
		</FormControl>
	);
};

export default AlignmentMatrixControl;
