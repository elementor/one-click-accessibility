import CardContent from '@elementor/ui/CardContent';
import Typography from '@elementor/ui/Typography';
import { styled } from '@elementor/ui/styles';
import { MainList } from '@ea11y-apps/scanner/components/main-list';
import { __ } from '@wordpress/i18n';

export const MainLayout = () => {
	return (
		<StyledContent>
			<Typography variant="body1" as="h3" sx={{ color: 'text.secondary' }}>
				{__('All issues', 'pojo-accessibility')}
			</Typography>

			<MainList />
		</StyledContent>
	);
};

const StyledContent = styled(CardContent)`
	display: flex;
	flex-direction: column;
	gap: ${({ theme }) => theme.spacing(2)};
	padding: 0 ${({ theme }) => theme.spacing(2)};
`;
