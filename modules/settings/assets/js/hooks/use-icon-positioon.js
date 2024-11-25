import { useSettings } from '@ea11y/hooks';
import { useCallback } from '@wordpress/element';

export const useIconPosition = () => {
	const { iconPosition, setIconPosition } = useSettings();

	const updateIconPosition = useCallback( ( device, key, value ) => {
		setIconPosition( ( prevState ) => ( {
			...prevState,
			[ device ]: {
				...prevState[ device ],
				[ key ]: value,
			},
		} ) );
	}, [ setIconPosition ] );

	const updateExactPosition = ( device, axis, direction, value, unit ) => {
		setIconPosition( ( prevState ) => ( {
			...prevState,
			[ device ]: {
				...prevState[ device ],
				exactPosition: {
					...prevState[ device ].exactPosition,
					[ axis ]: {
						direction,
						value,
						unit,
					},
				},
			},
		} ) );
	};

	return { iconPosition, updateIconPosition, updateExactPosition };
};
