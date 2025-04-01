import {
	createContext,
	useContext,
	useEffect,
	useState,
} from '@wordpress/element';

const ScannerWizardContext = createContext({
	results: {},
	getResults: () => {},
});

export const ScannerWizardContextProvider = ({ children }) => {
	const [results, setResults] = useState();

	const getResults = () => {
		window.ace.check(document).then((data) => {
			setResults(data);
		});
	};

	useEffect(() => {
		getResults();
	}, []);

	return (
		<ScannerWizardContext.Provider value={{ results, getResults }}>
			{children}
		</ScannerWizardContext.Provider>
	);
};

export const useScannerWizardContext = () => {
	return useContext(ScannerWizardContext);
};
