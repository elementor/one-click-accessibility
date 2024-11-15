import Box from '@elementor/ui/Box';
import Button from '@elementor/ui/Button';

export const BottomBar = () => {
	return (
		<Box display="flex"
			justifyContent="end"
			p={ 2 }
			width="100%">
			<Button variant="contained" color="info">Save Changes</Button>
		</Box>
	);
};
