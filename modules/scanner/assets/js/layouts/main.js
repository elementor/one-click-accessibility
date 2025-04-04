import InfoCircleIcon from '@elementor/icons/InfoCircleIcon';
import { Badge } from '@elementor/ui';
import Box from '@elementor/ui/Box';
import Card from '@elementor/ui/Card';
import CardContent from '@elementor/ui/CardContent';
import Infotip from '@elementor/ui/Infotip';
import Typography from '@elementor/ui/Typography';
import { styled } from '@elementor/ui/styles';
import { __ } from '@wordpress/i18n';

export const Main = () => {
	return (
		<StyledContent>
			<Typography variant="body1" sx={{ mb: 2 }}>
				{window?.ea11yScannerData?.currentPageTitle}
			</Typography>
			<Box display="flex" alignItems="center" gap={1} sx={{ mb: 1 }}>
				<Typography variant="body2">
					{__('Fix in scanner', 'pojo-accessibility')}
				</Typography>

				<Infotip
					content={
						<Typography variant="body2" sx={{ p: 2, maxWidth: '300px' }}>
							{__('Some info', 'pojo-accessibility')}
						</Typography>
					}
					PopperProps={{
						disablePortal: true,
						modifiers: [
							{
								name: 'zIndex',
								enabled: true,
								phase: 'write',
								fn: ({ state }) => {
									state.styles.popper.zIndex = 999999;
								},
							},
						],
					}}
				>
					<InfoCircleIcon fontSize="small" />
				</Infotip>
			</Box>
			<Card variant="outlined" sx={{ p: 1.5 }}>
				<Box display="flex" gap={1}>
					<Typography variant="subtitle2">
						{__('Alternative Text', 'pojo-accessibility')}
					</Typography>
					<Badge
						badgeContent={10}
						color="secondary"
						variant="standard"
						anchorOrigin={{
							vertical: 'top',
							horizontal: 'center', // center horizontally
						}}
						sx={{ top: '-1px' }}
					/>
				</Box>
			</Card>
		</StyledContent>
	);
};

const StyledContent = styled(CardContent)`
	padding: 16px 12px;
`;
