import SvgIcon from '@elementor/ui/SvgIcon';
import { useSettings } from '@ea11y/hooks';

function AccessibilityPersonIcon({ size }, props) {
	const { iconDesign } = useSettings();
	const strokeColor = `lch(from ${iconDesign?.color || '#fff'} calc((50 - l) * 100) 0 0)`;

	return (
		<SvgIcon
			viewBox="0 0 19 25"
			fill="none"
			sx={{ marginRight: 0, fontSize: size, paddingRight: '1px' }}
			{...props}
		>
			<path
				d="m4.834 23.375 5-7.5m0 0 5 7.5m-5-7.5v-5m0 0 7.5-2.5m-7.5 2.5-7.5-2.5m8.75-5.5a1.25 1.25 0 1 1-2.5 0 1.25 1.25 0 0 1 2.5 0Z"
				stroke={strokeColor}
				strokeWidth="3"
				strokeLinecap="round"
				strokeLinejoin="round"
			/>
		</SvgIcon>
	);
}

export default AccessibilityPersonIcon;
