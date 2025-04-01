import Paper from '@elementor/ui/Paper';
import { styled } from '@elementor/ui/styles';
import { Header } from '@ea11y-apps/scanner/components/header';
import { ScannerWizardContextProvider } from '@ea11y-apps/scanner/context/scanner-wizard-context';

const App = () => {
	return (
		<ScannerWizardContextProvider>
			<StyledPaper>
				<Header />
			</StyledPaper>
		</ScannerWizardContextProvider>
	);
};

const StyledPaper = styled(Paper)`
	position: fixed;
	top: 32px;
	right: 0;
	width: 360px;
	height: calc(100vh - 32px);
	overflow-y: auto;
`;
export default App;
