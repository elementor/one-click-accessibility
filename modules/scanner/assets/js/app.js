import Card from '@elementor/ui/Card';
import CardContent from '@elementor/ui/CardContent';
import Container from '@elementor/ui/Container';
import Paper from '@elementor/ui/Paper';
import Typography from '@elementor/ui/Typography';
import { styled } from '@elementor/ui/styles';
import { Header } from '@ea11y-apps/scanner/components/header';
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
			<Header />
			<Container>
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
	top: 32px;
	right: 0;
	width: 360px;
	height: calc(100vh - 32px);
	overflow-y: auto;
`;
export default App;
