import SvgIcon from '@elementor/ui/SvgIcon';
import { useSettings } from '@ea11y/hooks';

function AccessibilityPersonIcon({ size }, props) {
	const { iconDesign } = useSettings();
	const strokeColor = `lch(from ${iconDesign?.color || '#fff'} calc((50 - l) * 100) 0 0)`;

	return (
		<SvgIcon
			viewBox="0 0 19 25"
			fill="none"
			sx={{ marginRight: 0, fontSize: size }}
			{...props}
		>
			<path
				d="M4.83398 23.375L9.83399 15.875M9.83399 15.875L14.834 23.375M9.83399 15.875V10.875M9.83399 10.875L17.334 8.375M9.83399 10.875L2.33398 8.375M11.084 2.875C11.084 3.56536 10.5243 4.125 9.83399 4.125C9.14363 4.125 8.58399 3.56536 8.58399 2.875C8.58399 2.18464 9.14363 1.625 9.83399 1.625C10.5243 1.625 11.084 2.18464 11.084 2.875Z"
				stroke={strokeColor}
				strokeWidth="3"
				strokeLinecap="round"
				strokeLinejoin="round"
			/>
		</SvgIcon>
	);
}

export default AccessibilityPersonIcon;
