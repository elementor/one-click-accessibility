import CardContent from '@elementor/ui/CardContent';
import { styled } from '@elementor/ui/styles';
import { ManuallyFix, ScannerFix } from '../components/main-parts';

export const MainLayout = () => {
	return (
		<StyledContent>
			<ScannerFix />
			<ManuallyFix />
		</StyledContent>
	);
};

const StyledContent = styled(CardContent)`
	display: flex;
	flex-direction: column;
	gap: ${({ theme }) => theme.spacing(2)};
	padding: 0 ${({ theme }) => theme.spacing(1.5)};
`;
