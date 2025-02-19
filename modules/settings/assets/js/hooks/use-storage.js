import { store as coreDataStore } from '@wordpress/core-data';
import { dispatch } from '@wordpress/data';

export const useStorage = () => {
	const save = async (data) => {
		return await dispatch(coreDataStore).saveEntityRecord('root', 'site', data);
	};

	return {
		save,
	};
};
