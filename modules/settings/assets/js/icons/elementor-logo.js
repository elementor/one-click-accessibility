import SvgIcon from '@elementor/ui/SvgIcon';

const ElementorLogo = ({ size }) => {
	return (
		<SvgIcon viewBox="0 0 24 24" fontSize={size}>
			<g clipPath="url(#a)">
				<path
					fill="#0C0D0E"
					fillRule="evenodd"
					d="M2.022 18.667A12 12 0 1 1 21.977 5.333 12 12 0 0 1 2.022 18.667ZM9 7H7v10h2V7Zm8 0h-6v2h6V7Zm0 3.999h-6v2h6v-2ZM17 15h-6v2h6v-2Z"
					clipRule="evenodd"
				/>
			</g>

			<defs>
				<clipPath id="a">
					<path fill="#fff" d="M0 0h24v24H0z" />
				</clipPath>
			</defs>
		</SvgIcon>
	);
};

export default ElementorLogo;
