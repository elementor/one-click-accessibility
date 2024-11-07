import '../css/style.css';
import DirectionProvider from '@elementor/ui/DirectionProvider';
import { ThemeProvider } from '@elementor/ui/styles';

const App = () => {
	return (
		<DirectionProvider rtl={ false /* Add RTL detection in settings */ }>
			<ThemeProvider colorScheme="light">
			</ThemeProvider>
		</DirectionProvider>
	);
};

export default App;
