import PropTypes from 'prop-types';
import {
	createContext,
	useContext,
	useState,
	useRef,
	useCallback,
} from '@wordpress/element';

const BulkGenerationContext = createContext(null);

export const BulkGenerationProvider = ({ children }) => {
	const [currentGeneratingIndex, setCurrentGeneratingIndex] = useState(null);
	const [isGenerating, setIsGenerating] = useState(false);
	const [quotaError, setQuotaError] = useState(null);
	const shouldAbortRef = useRef(false);
	const queueRef = useRef([]);
	const progressRef = useRef({ completed: 0, total: 0, errors: 0 });
	const [progress, setProgress] = useState({
		completed: 0,
		total: 0,
		errors: 0,
	});

	const startBulkGeneration = useCallback((cardIndices) => {
		shouldAbortRef.current = false;
		queueRef.current = [...cardIndices];
		progressRef.current = {
			completed: 0,
			total: cardIndices.length,
			errors: 0,
		};
		setProgress({ completed: 0, total: cardIndices.length, errors: 0 });
		setQuotaError(null);
		setIsGenerating(true);

		if (cardIndices.length > 0) {
			setCurrentGeneratingIndex(cardIndices[0]);
		} else {
			setIsGenerating(false);
		}
	}, []);

	const stopBulkGeneration = useCallback(() => {
		shouldAbortRef.current = true;
		queueRef.current = [];
		setCurrentGeneratingIndex(null);
		setIsGenerating(false);
	}, []);

	const onCardComplete = useCallback((success) => {
		progressRef.current.completed += 1;
		if (!success) {
			progressRef.current.errors += 1;
		}
		setProgress({ ...progressRef.current });

		queueRef.current.shift();

		if (shouldAbortRef.current || queueRef.current.length === 0) {
			setCurrentGeneratingIndex(null);
			setIsGenerating(false);
		} else {
			setCurrentGeneratingIndex(queueRef.current[0]);
		}
	}, []);

	const resetProgress = useCallback(() => {
		setIsGenerating(false);
		shouldAbortRef.current = false;
		queueRef.current = [];
		setCurrentGeneratingIndex(null);
		progressRef.current = { completed: 0, total: 0, errors: 0 };
		setProgress({ completed: 0, total: 0, errors: 0 });
		setQuotaError(null);
	}, []);

	const setQuotaExceeded = useCallback((errorMessage) => {
		setQuotaError(errorMessage);
		shouldAbortRef.current = true;
		queueRef.current = [];
		setCurrentGeneratingIndex(null);
		setIsGenerating(false);
	}, []);

	const value = {
		currentGeneratingIndex,
		isGenerating,
		shouldAbort: shouldAbortRef,
		progress,
		quotaError,
		startBulkGeneration,
		stopBulkGeneration,
		onCardComplete,
		resetProgress,
		setQuotaExceeded,
	};

	return (
		<BulkGenerationContext.Provider value={value}>
			{children}
		</BulkGenerationContext.Provider>
	);
};

BulkGenerationProvider.propTypes = {
	children: PropTypes.node.isRequired,
};

export const useBulkGeneration = () => {
	const context = useContext(BulkGenerationContext);
	return context;
};
