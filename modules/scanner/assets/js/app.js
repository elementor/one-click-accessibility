import Container from '@elementor/ui/Container';
import Paper from '@elementor/ui/Paper';
import Typography from '@elementor/ui/Typography';
import { styled } from '@elementor/ui/styles';
import { useEffect, useState } from '@wordpress/element';

const App = () => {
	const [results, setResults] = useState();
	useEffect(() => {
		window.ace.check(document, ['WCAG_2_1']).then((data) => {
			setResults(data?.results);
			console.log(data.summary);
		});
	}, [window]);

	return (
		<StyledPaper>
			<Container>
				<Typography variant="subtitle1">Scanner Wizard</Typography>
				{results?.map((item, index) => (
					<Typography key={index} variant="body1">
						{item.ruleId} - {item.level}
					</Typography>
				))}
			</Container>
		</StyledPaper>
	);
};

const StyledPaper = styled(Paper)`
	position: fixed;
	top: 60px;
	right: 30px;
	width: 300px;
	height: 600px;
	overflow-y: auto;
`;
export default App;
