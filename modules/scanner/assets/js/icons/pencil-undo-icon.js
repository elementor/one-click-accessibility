import SvgIcon from '@elementor/ui/SvgIcon';

const PencilUndoIcon = (props, { size = 'tiny' }) => {
	return (
		<SvgIcon viewBox="0 0 20 20" fontSize={size} {...props}>
			<g clipPath="url(#a)">
				<path
					fill="currentColor"
					d="M13.75 3.352A2.9 2.9 0 0 1 15.8 8.3l-8.75 8.75a.54.54 0 0 1-.383.159H3.333a.543.543 0 0 1-.542-.542v-3.334c0-.143.058-.28.16-.382l7.906-7.908.01-.01.009-.009.824-.823a2.9 2.9 0 0 1 2.05-.85m4.583 11.939a.542.542 0 0 1 0 1.084h-5a.542.542 0 0 1 0-1.084zM3.875 13.558v2.567h2.567l7.374-7.375-2.567-2.567zm9.875-9.122c-.238 0-.475.045-.695.136s-.42.226-.588.395l-.45.449 2.566 2.567.45-.449a1.82 1.82 0 0 0 .394-1.978 1.82 1.82 0 0 0-1.677-1.12"
				/>
			</g>
			<defs>
				<clipPath id="a">
					<path fill="#fff" d="M0 0h20v20H0z" />
				</clipPath>
			</defs>
		</SvgIcon>
	);
};

export default PencilUndoIcon;
