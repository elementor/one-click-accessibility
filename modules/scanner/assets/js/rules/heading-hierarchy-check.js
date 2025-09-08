/**
 * Heading Hierarchy Check Rule
 *
 * This rule checks for proper heading hierarchy.
 * Skipping heading levels can confuse screen readers and break document outline.
 *
 * Compatible with ACE (accessibility-checker-engine)
 */
import {
	getHeadingLevel,
	getHeadingXpath,
	getPageHeadings,
} from '../utils/page-headings';

const headingHierarchyCheck = {
	id: 'heading_hierarchy_check',
	context: 'dom:html',
	dependencies: [],
	help: {
		'en-US': {
			group: 'Heading Structure',
			pass: 'Heading hierarchy follows proper sequence',
			fail_skipped_level:
				'Heading levels are skipped in the document. Maintain proper heading hierarchy to help screen readers understand the content structure.',
		},
	},
	messages: {
		'en-US': {
			group: 'Heading Structure',
			pass: 'Heading hierarchy follows proper sequence',
			fail_skipped_level:
				'Heading levels are skipped. Ensure headings follow proper hierarchy (h1 -> h2 -> h3).',
		},
	},
	rulesets: [
		{
			id: ['IBM_Accessibility'],
			num: '1.3.1',
			level: 'recommendation',
			toolkitLevel: 'LEVEL_ONE',
		},
	],
	run: (context) => {
		const document = context.dom.node;
		const headings = getPageHeadings(document);

		if (headings.length === 0) {
			return {
				ruleId: 'heading_hierarchy_check',
				reasonId: 'pass',
				value: ['RECOMMENDATION', 'PASS'],
				path: {
					dom: '/html[1]',
					aria: '/document[1]',
				},
				ruleTime: 0,
				message: 'No headings found',
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
				level: 'pass',
			};
		}

		// Extract heading levels and check for skips
		let previousLevel = 0;
		let violatingElement = null;
		const skippedLevels = [];

		for (const heading of headings) {
			const currentLevel = getHeadingLevel(heading);

			if (previousLevel > 0 && currentLevel > previousLevel + 1) {
				violatingElement = heading;

				for (let i = previousLevel + 1; i < currentLevel; i++) {
					skippedLevels.push(`h${i}`);
				}

				break;
			}

			previousLevel = currentLevel;
		}

		if (violatingElement) {
			const rect = violatingElement.getBoundingClientRect();

			return {
				ruleId: 'heading_hierarchy_check',
				reasonId: 'fail_skipped_level',
				value: ['RECOMMENDATION', 'FAIL'],
				path: {
					dom: getHeadingXpath(violatingElement),
					aria: '/document[1]',
				},
				node: violatingElement,
				ruleTime: 0,
				message: `Heading levels are skipped. Ensure headings follow proper hierarchy. Missing: ${skippedLevels.join(', ')}.`,
				messageArgs: [skippedLevels.join(', ')],
				apiArgs: [],
				bounds: {
					left: Math.round(rect.left),
					top: Math.round(rect.top),
					height: Math.round(rect.height),
					width: Math.round(rect.width),
				},
				snippet: violatingElement.outerHTML,
				category: 'Accessibility',
				ignored: false,
				level: 'recommendation',
			};
		}

		return {
			ruleId: 'heading_hierarchy_check',
			reasonId: 'pass',
			value: ['RECOMMENDATION', 'PASS'],
			path: {
				dom: '/html[1]',
				aria: '/document[1]',
			},
			ruleTime: 0,
			message: 'Heading hierarchy follows proper sequence',
			messageArgs: [],
			apiArgs: [],
			bounds: {
				left: 0,
				top: 0,
				height: 0,
				width: 0,
			},
			snippet: headings[0]?.outerHTML || '<html>',
			category: 'Accessibility',
			ignored: false,
			level: 'pass',
		};
	},
};

export default headingHierarchyCheck;
