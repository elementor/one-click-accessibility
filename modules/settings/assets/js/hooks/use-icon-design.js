import { useSettings } from '@ea11y/hooks';

export const useIconDesign = () => {
	const { iconDesign, setIconDesign } = useSettings();

	const updateIconDesign = ( newValues ) => {
		setIconDesign( ( prev ) => ( {
			...prev,
			...newValues,
		} ) );
	};

	return { iconDesign, updateIconDesign };
};
