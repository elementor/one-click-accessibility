export const getElementByXPath = (originXpath, context = document) => {
	try {
		const xpath = originXpath.replace('svg', "*[name()='svg']");
		return document.evaluate(
			xpath,
			context,
			null,
			XPathResult.FIRST_ORDERED_NODE_TYPE,
			null,
		).singleNodeValue;
	} catch (e) {
		console.error(e);
		return null;
	}
};
