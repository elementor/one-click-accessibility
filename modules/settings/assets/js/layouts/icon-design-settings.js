import Box from '@elementor/ui/Box';
import Grid from '@elementor/ui/Grid';
import Typography from '@elementor/ui/Typography';
import { styled } from '@elementor/ui/styles';
import {
	ColorPicker,
	IconRadius,
	IconSelect,
	IconSize,
} from '@ea11y/components';
import { __ } from '@wordpress/i18n';

const StyledGrid = styled(Grid)`
	display: grid;
	gap: ${({ theme }) => theme.spacing(5)};
	padding: ${({ theme }) => theme.spacing(2)};
	grid-template-columns: repeat(2, 1fr);

	${({ theme }) => theme.breakpoints.down('lg')} {
		grid-template-columns: repeat(1, 1fr);
	}
`;

const IconDesignSettings = (props) => {
	return (
		<Grid padding={2} border={1} borderColor="divider" {...props}>
			<Box marginBottom={2}>
				<Typography variant="subtitle1">
					{__('Style', 'pojo-accessibility')}
				</Typography>

				<Typography variant="body2">
					{__(
						"Customize your widget's color, icon, and size to match your brand.",
						'pojo-accessibility',
					)}
				</Typography>
			</Box>

			<StyledGrid>
				<Box display="flex" flexDirection="column" gap={5}>
					<IconSelect />
					<IconSize />
				</Box>

				<Box>
					<ColorPicker />
				</Box>
			</StyledGrid>
			<StyledGrid>
				<IconRadius />
			</StyledGrid>
		</Grid>
	);
};

export default IconDesignSettings;
