import useScannerWizardActions from '@ea11y-apps/scanner/hooks/scanner-context/useScannerWizardActions';
import useScannerWizardEffects from '@ea11y-apps/scanner/hooks/scanner-context/useScannerWizardEffects';
import useScannerWizardState from '@ea11y-apps/scanner/hooks/scanner-context/useScannerWizardState';
import { createContext, useContext } from '@wordpress/element';

export const ScannerWizardContext = createContext(null);

const ScannerWizardContextProvider = ({ children }) => {
	const state = useScannerWizardState();
	const actions = useScannerWizardActions(state);
	useScannerWizardEffects(state, actions);

	const value = { ...state, ...actions };

	return (
		<ScannerWizardContext.Provider value={value}>
			{children}
		</ScannerWizardContext.Provider>
	);
};

export default ScannerWizardContextProvider;
export const useScannerWizardContext = () => useContext(ScannerWizardContext);
