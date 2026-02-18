import Grid from '@elementor/ui/Grid';
import { styled } from '@elementor/ui/styles';

export const StyledMainWrapperGrid = styled(Grid)`
	padding: 16px;
	gap: 8px;
	align-items: center;
	position: sticky;
	top: 0;
	z-index: 1000;
`;

export const StyledActionsGrid = styled(Grid)`
	display: flex;
	gap: 8px;
	align-items: center;
	flex-wrap: nowrap;
`;
