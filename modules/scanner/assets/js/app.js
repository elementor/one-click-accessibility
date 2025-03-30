import Card from '@elementor/ui/Card';
import CardContent from '@elementor/ui/CardContent';
import Container from '@elementor/ui/Container';
import Paper from '@elementor/ui/Paper';
import Typography from '@elementor/ui/Typography';
import { styled } from '@elementor/ui/styles';
import { useEffect, useState } from '@wordpress/element';

const App = () => {
	const [results, setResults] = useState();
	useEffect(() => {
		window.ace.check(document).then((data) => {
			const filtredResults = data?.results.filter(
				(item) => item.level !== 'pass',
			);
			setResults(filtredResults);
		});
	}, []);

	return (
		<StyledPaper>
			<Container>
				<Typography variant="subtitle1">Scanner Wizard</Typography>
				{results?.map((item, index) => (
					<Card key={index} sx={{ mb: 1 }}>
						<CardContent>
							<Typography variant="body1">
								{item.ruleId} - {item.level}
							</Typography>
							<Typography variant="body2">{item.message}</Typography>
							<Typography variant="caption">{item.snippet}</Typography>
						</CardContent>
					</Card>
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
