import { store as coreDataStore } from '@wordpress/core-data';
import { dispatch, useSelect } from '@wordpress/data';

const useStorage = () => {
	const save = async (data) => {
		return await dispatch(coreDataStore).saveEntityRecord('root', 'site', data);
	};

	// Fetch site data with useSelect and check resolution status
	const get = useSelect((select) => {
		return {
			data: select(coreDataStore).getEntityRecord('root', 'site'),
			hasFinishedResolution: select(coreDataStore).hasFinishedResolution(
				'getEntityRecord',
				['root', 'site'],
			),
		};
	}, []);

	return {
		save,
		get,
	};
};

export default useStorage;
