import Box from '@elementor/ui/Box';
import Typography from '@elementor/ui/Typography';
import { styled } from '@elementor/ui/styles';

export const StyledStatsItem = styled(Box)`
	display: flex;
	justify-content: space-between;
	align-items: center;

	padding: ${({ theme }) => `${theme.spacing(2)} ${theme.spacing(2.5)}`};

	border-radius: ${({ theme }) => theme.shape.borderRadius * 2}px;
	background: ${({ theme }) => theme.palette.background.default};

	:nth-of-type(1) {
		grid-area: 1 / 1 / 2 / 2;
	}

	:nth-of-type(2) {
		grid-area: 1 / 2 / 2 / 3;
	}

	:nth-of-type(3) {
		grid-area: 2 / 1 / 3 / 3;
	}

	:nth-of-type(4) {
		grid-area: 1 / 3 / 3 / 4;
	}

	@media screen and (max-width: 960px) {
		:nth-of-type(1) {
			grid-area: 1 / 1 / 2 / 2;
		}

		:nth-of-type(2) {
			grid-area: 2 / 1 / 3 / 2;
		}

		:nth-of-type(3) {
			grid-area: 3 / 1 / 4 / 2;
		}

		:nth-of-type(4) {
			grid-area: 4 / 1 / 5 / 2;
		}
	}
`;

export const StyledStatsItemContent = styled(Box)`
	min-width: 150px;
	min-height: 50px;
	height: 100%;
`;

export const StyledStatsItemChart = styled(Box)`
	margin-inline-start: ${({ theme }) => theme.spacing(2)};

	@media screen and (max-width: 1200px) {
		& {
			display: none;
		}
	}
`;

export const StyledStatsItemTitle = styled(Typography)`
	display: flex;
	justify-content: flex-start;
	align-items: center;

	margin: 0;
	margin-bottom: ${({ spacing, theme }) => theme.spacing(spacing || 2)};

	color: ${({ theme }) => theme.palette.text.primary};
	font-feature-settings:
		'liga' off,
		'clig' off;
	font-size: 16px;
	font-weight: 500;
	line-height: 130%;
	letter-spacing: 0.15px;

	& svg {
		margin-inline-start: ${({ theme }) => theme.spacing(1)};
	}
`;
