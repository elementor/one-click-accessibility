import { default as MuiButton } from '@elementor/ui/Button';
import { styled } from '@elementor/ui/styles';

const StyledInfoButton = styled(MuiButton)`
	&.MuiButton-colorInfo:focus,
	&.MuiButton-colorInfo:focus-visible {
		box-shadow: 0 0 0 3px #5e9ed6;
	}
`;

const Button = ({ ...props }) => {
	if ('info' === props.color) {
		return <StyledInfoButton {...props} />;
	}

	return <MuiButton {...props} />;
};

export default Button;
