import SvgIcon from '@elementor/ui/SvgIcon';

const VolumeIcon = (props, { size }) => {
	return (
		<SvgIcon viewBox="0 0 24 24" fontSize={size} {...props}>
			<path
				xmlns="http://www.w3.org/2000/svg"
				d="M17 8C17.621 8.46574 18.125 9.06966 18.4721 9.76393C18.8193 10.4582 19 11.2238 19 12C19 12.7762 18.8193 13.5418 18.4721 14.2361C18.125 14.9303 17.621 15.5343 17 16"
				stroke="black"
				strokeWidth="1.5"
				strokeLinecap="round"
				strokeLinejoin="round"
				fill="transparent"
			/>
			<path
				xmlns="http://www.w3.org/2000/svg"
				d="M8 15.0002H6C5.73478 15.0002 5.48043 14.8949 5.29289 14.7073C5.10536 14.5198 5 14.2654 5 14.0002V10.0002C5 9.735 5.10536 9.48065 5.29289 9.29311C5.48043 9.10557 5.73478 9.00022 6 9.00022H8L11.5 4.50022C11.5874 4.33045 11.7326 4.19754 11.9095 4.12551C12.0863 4.05348 12.2831 4.04708 12.4643 4.10746C12.6454 4.16784 12.799 4.29103 12.8972 4.45476C12.9955 4.61849 13.0319 4.81196 13 5.00022V19.0002C13.0319 19.1885 12.9955 19.3819 12.8972 19.5457C12.799 19.7094 12.6454 19.8326 12.4643 19.893C12.2831 19.9534 12.0863 19.947 11.9095 19.8749C11.7326 19.8029 11.5874 19.67 11.5 19.5002L8 15.0002Z"
				stroke="black"
				strokeWidth="1.5"
				strokeLinecap="round"
				strokeLinejoin="round"
				fill="transparent"
			/>
		</SvgIcon>
	);
};

export default VolumeIcon;
