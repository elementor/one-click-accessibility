import CardContent from '@elementor/ui/CardContent';
import Skeleton from '@elementor/ui/Skeleton';
import { styled } from '@elementor/ui/styles';

export const StyledContent = styled(CardContent)`
	padding: 0 ${({ theme }) => theme.spacing(1.5)};
`;

export const StyledSkeleton = styled(Skeleton)`
	transform: scale(1);
`;
