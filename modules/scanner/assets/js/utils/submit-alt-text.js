import { APIScanner } from '@ea11y-apps/scanner/api/APIScanner';
import { BLOCKS } from '@ea11y-apps/scanner/constants';

export const submitAltTextRemediation = async ({
	item,
	altText,
	makeDecorative,
	isGlobal,
	apiId,
	currentScanId,
	updateRemediationList,
}) => {
	const makeAttributeData = () => {
		if (makeDecorative) {
			return {
				attribute_name: 'role',
				attribute_value: 'presentation',
			};
		}

		if (item.node.tagName === 'svg') {
			return {
				attribute_name: 'aria-label',
				attribute_value: altText,
			};
		}

		return {
			attribute_name: 'alt',
			attribute_value: altText,
		};
	};

	const match = item.node.className.toString().match(/wp-image-(\d+)/);
	const finalAltText = !makeDecorative ? altText : '';
	const find = item.snippet;

	try {
		if (match && item.node.tagName !== 'svg') {
			void APIScanner.submitAltText(item.node.src, finalAltText);
		}
		const response = await APIScanner.submitRemediation({
			url: window?.ea11yScannerData?.pageData.url,
			remediation: {
				...makeAttributeData(),
				action: 'add',
				xpath: item.path.dom,
				find,
				category: item.reasonCategory.match(/\((AAA?|AA?|A)\)/)?.[1] || '',
				type: 'ATTRIBUTE',
			},
			global: isGlobal,
			rule: item.ruleId,
			group: BLOCKS.altText,
			apiId,
		});

		await APIScanner.resolveIssue(currentScanId);
		void updateRemediationList();
		return response.remediation;
	} catch (e) {
		console.warn(e);
		throw e;
	}
};
