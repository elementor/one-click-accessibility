/**
 * Single H1 Check Rule
 *
 * This rule ensures that a page contains only a single h1 tag.
 * Multiple h1 tags can confuse screen readers and break the document outline.
 *
 * Compatible with ACE (accessibility-checker-engine)
 */
import { getH1Headings } from '@ea11y-apps/scanner/utils/page-headings';

const singleH1Check = {
	id: 'single_h1_check',
	context: 'dom:html',
	dependencies: [],
	help: {
		'en-US': {
			group: 'Heading Structure',
			pass: 'Page contains exactly one h1 tag',
			fail_multiple:
				'Multiple h1 tags found on the page. Each page should have only one main heading (h1) to establish proper document structure.',
			pass_no_h1:
				'No h1 tag found - this may be acceptable for some page types',
		},
	},
	messages: {
		'en-US': {
			group: 'Heading Structure',
			pass: 'Page contains exactly one h1 tag',
			fail_multiple:
				'Multiple h1 tags found. Ensure the page contains only one h1 tag to maintain proper heading hierarchy.',
			pass_no_h1: 'No h1 tag found',
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
		const document = context.dom.node;
		const headings = getH1Headings(document);

		if (headings.length > 1) {
			return {
				ruleId: 'single_h1_check',
				reasonId: 'fail_multiple',
				value: ['VIOLATION', 'FAIL'],
				path: {
					dom: '/html[1]',
					aria: '/document[1]',
				},
				node: headings[1],
				ruleTime: 0,
				message:
					'Multiple h1 tags found. Ensure the page contains only one h1 tag to maintain proper heading hierarchy.',
				messageArgs: [headings.length.toString()],
				apiArgs: [],
				bounds: {
					left: 0,
					top: 0,
					height: 0,
					width: 0,
				},
				snippet: `Found ${headings.length} h1 tags`,
				category: 'Accessibility',
				ignored: false,
				level: 'violation',
			};
		}

		return {
			ruleId: 'single_h1_check',
			reasonId: 'pass',
			value: ['VIOLATION', 'PASS'],
			path: {
				dom: '/html[1]',
				aria: '/document[1]',
			},
			ruleTime: 0,
			message:
				headings.length === 1
					? 'Page contains exactly one h1 tag'
					: 'Page contains no duplicate h1 tags',
			messageArgs: [],
			apiArgs: [],
			bounds: {
				left: 0,
				top: 0,
				height: 0,
				width: 0,
			},
			snippet: headings.length > 0 ? headings[0].outerHTML : '<html>',
			category: 'Accessibility',
			ignored: false,
			level: 'pass',
		};
	},
};

export default singleH1Check;
