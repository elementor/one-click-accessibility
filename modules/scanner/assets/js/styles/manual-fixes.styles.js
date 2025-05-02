import Accordion from '@elementor/ui/Accordion';
import AccordionDetails from '@elementor/ui/AccordionDetails';
import AccordionSummary from '@elementor/ui/AccordionSummary';
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

export const SectionTitle = styled(Typography)`
	font-weight: bold;
`;

export const StyledSnippet = styled(Typography)`
	width: 320px;
	word-break: break-word;
`;
