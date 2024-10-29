import '../css/style.css';
import DirectionProvider from '@elementor/ui/DirectionProvider';
import { ThemeProvider } from '@elementor/ui/styles';
import ConnectModal from './components/connect-modal';

const App = () => {
	return (
		<DirectionProvider rtl={ false /* Add RTL detection in settings */ }>
			<ThemeProvider colorScheme="light">
				<ConnectModal />
			</ThemeProvider>
		</DirectionProvider>
	);
};

export default App;
