import { useSettings } from '@ea11y/hooks';

export const useIconDesign = () => {
	const { iconDesign, setIconDesign, setHasChanges } = useSettings();

	const updateIconDesign = (newValues) => {
		setIconDesign((prev) => ({
			...prev,
			...newValues,
		}));

		setHasChanges(true);
	};

	return { iconDesign, updateIconDesign };
};
