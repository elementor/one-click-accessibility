import Switch from '@elementor/ui/Switch';
import { styled } from '@elementor/ui/styles';

const StyledSwitch = styled(Switch)`
	input {
		height: 56px !important;
	}
`;

// Add the options to the StyledSwitch component
const CustomSwitch = (props) => (
	<StyledSwitch size="medium" color="info" {...props} />
);

export default CustomSwitch;
