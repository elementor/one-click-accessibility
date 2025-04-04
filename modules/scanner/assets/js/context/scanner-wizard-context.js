import {
	createContext,
	useContext,
	useEffect,
	useState,
} from '@wordpress/element';

const ScannerWizardContext = createContext({
	results: {},
	resolved: 0,
	setResolved: () => {},
	getResults: () => {},
});

export const ScannerWizardContextProvider = ({ children }) => {
	const [results, setResults] = useState();
	const [resolved, setResolved] = useState(0);

	const getResults = () => {
		window.ace.check(document).then((data) => {
			setResults(data);
		});
	};

	useEffect(() => {
		getResults();
	}, []);

	return (
		<ScannerWizardContext.Provider
			value={{ results, resolved, setResolved, getResults }}
		>
			{children}
		</ScannerWizardContext.Provider>
	);
};

export const useScannerWizardContext = () => {
	return useContext(ScannerWizardContext);
};
