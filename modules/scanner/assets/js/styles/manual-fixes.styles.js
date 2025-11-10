import Accordion from '@elementor/ui/Accordion';
import AccordionDetails from '@elementor/ui/AccordionDetails';
import AccordionSummary from '@elementor/ui/AccordionSummary';
import Box from '@elementor/ui/Box';
import TextField from '@elementor/ui/TextField';
import Typography from '@elementor/ui/Typography';
import { styled } from '@elementor/ui/styles';

export const StyledAccordion = styled(Accordion)`
	border-right: none;
	border-left: none;
`;

export const StyledAccordionSummary = styled(AccordionSummary)`
	min-height: 44px;
	& .MuiAccordionSummary-content {
		align-items: center;
		gap: ${({ theme }) => theme.spacing(1)};
		width: calc(100% - ${({ theme }) => theme.spacing(4)});
	}
	& .MuiRadio-root {
		padding: 0;
	}
	& .MuiRadio-root.Mui-disabled {
		color: ${({ theme }) => theme.palette.action.active};
	}
	& .MuiRadio-root.Mui-checked {
		color: ${({ theme }) => theme.palette.info.main};
	}
`;

export const StyledAccordionDetails = styled(AccordionDetails)`
	display: flex;
	flex-direction: column;
	gap: ${({ theme }) => theme.spacing(2)};
	padding-bottom: 0;
`;

export const StyledSnippet = styled(Typography)`
	word-break: break-word;
`;

export const InfotipBox = styled(Box)`
	padding: ${({ theme }) => theme.spacing(2)};
	max-width: 368px;
	white-space: normal;
`;

export const InfotipImage = styled('img')`
	max-width: 304px;
	height: auto;
`;

export const InfotipFooter = styled(Box)`
	display: flex;
	justify-content: flex-end;
	margin-top: ${({ theme }) => theme.spacing(2)};
`;

export const ItemHeader = styled(Box)`
	display: flex;
	justify-content: space-between;
	margin-bottom: ${({ theme }) => theme.spacing(1)};
	min-height: ${({ theme }) => theme.spacing(4)};
`;

export const ItemTitle = styled(Box)`
	display: flex;
	gap: ${({ theme }) => theme.spacing(1)};
	align-items: center;
`;

export const ManualTextField = styled(TextField)`
	textarea {
		font-size: 14px;
	}
`;

export const TitleBox = styled(Box)`
	display: flex;
	justify-content: space-between;
	align-items: center;
	margin-bottom: ${({ theme }) => theme.spacing(0.5)};
	gap: ${({ theme }) => theme.spacing(0.5)};
`;
