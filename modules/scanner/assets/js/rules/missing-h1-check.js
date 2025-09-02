/**
 * Missing H1 Check Rule
 *
 * This rule ensures that a page contains at least one h1 tag.
 * Missing h1 tags can make it difficult for screen readers to understand the page structure.
 *
 * Compatible with ACE (accessibility-checker-engine)
 */

const missingH1Check = {
	id: 'missing_h1_check',
	context: 'dom:html',
	dependencies: [],
	help: {
		'en-US': {
			group: 'Heading Structure',
			pass: 'Page contains an h1 tag',
			fail_no_h1:
				'No h1 tag found on the page. Each page should have a main heading (h1) to establish proper document structure and help users understand the page content.',
		},
	},
	messages: {
		'en-US': {
			group: 'Heading Structure',
			pass: 'Page contains an h1 tag',
			fail_no_h1:
				'No h1 tag found. Add a main heading (h1) to establish the page structure.',
		},
	},
	rulesets: [
		{
			id: ['IBM_Accessibility'],
			num: '1.3.1',
			level: 'violation',
			toolkitLevel: 'LEVEL_ONE',
		},
	],
	run: (context) => {
		const doc = context.dom.node;
		const h1Elements = doc.querySelectorAll('h1');

		if (h1Elements.length === 0) {
			// Return violation result for missing h1 tag
			return {
				ruleId: 'missing_h1_check',
				reasonId: 'fail_no_h1',
				value: ['VIOLATION', 'FAIL'],
				path: {
					dom: '/html[1]',
					aria: '/document[1]',
				},
				ruleTime: 0,
				message:
					'No h1 tag found. Add a main heading (h1) to establish the page structure.',
				messageArgs: [],
				apiArgs: [],
				bounds: {
					left: 0,
					top: 0,
					height: 0,
					width: 0,
				},
				snippet: '<html>',
				category: 'Accessibility',
				ignored: false,
				level: 'violation',
			};
		}
		// Return pass result if h1 tag exists
		return {
			ruleId: 'missing_h1_check',
			reasonId: 'pass',
			value: ['VIOLATION', 'PASS'],
			path: {
				dom: '/html[1]',
				aria: '/document[1]',
			},
			ruleTime: 0,
			message: 'Page contains an h1 tag',
			messageArgs: [],
			apiArgs: [],
			bounds: {
				left: 0,
				top: 0,
				height: 0,
				width: 0,
			},
			snippet: h1Elements[0].outerHTML,
			category: 'Accessibility',
			ignored: false,
			level: 'pass',
		};
	},
};

export default missingH1Check;
