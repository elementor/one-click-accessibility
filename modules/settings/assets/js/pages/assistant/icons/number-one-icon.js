import SvgIcon from '@elementor/ui/SvgIcon';

const NumberOneIcon = (props) => {
	return (
		<SvgIcon width="25" height="24" fill="none" {...props}>
			<path
				fill="#000"
				fillOpacity=".54"
				d="M13.5 8a.75.75 0 0 0-1.28-.53l-2 2a.75.75 0 0 0 1.06 1.06l.72-.72V16a.75.75 0 0 0 1.5 0V8Z"
			/>
			<path
				fill="#000"
				fillOpacity=".54"
				fillRule="evenodd"
				d="M12.5 2.25a9.75 9.75 0 1 0 0 19.5 9.75 9.75 0 0 0 0-19.5ZM9.343 4.378a8.25 8.25 0 1 1 6.314 15.244A8.25 8.25 0 0 1 9.343 4.378Z"
				clipRule="evenodd"
			/>
		</SvgIcon>
	);
};

export default NumberOneIcon;
