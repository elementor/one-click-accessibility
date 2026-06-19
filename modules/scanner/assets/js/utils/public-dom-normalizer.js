import { ROOT_ID } from '@ea11y-apps/scanner/constants';

let removedNodes = [];

/**
 * Builds a stable signature for a top-level child node.
 *
 * @param {Element} el
 */
const buildSignature = (el) => {
	if (!el || el.nodeType !== Node.ELEMENT_NODE) {
		return '';
	}

	const tag = el.tagName.toLowerCase();
	const id = el.id ? `#${el.id}` : '';

	const unstableClassRegex =
		/^(wp-|is-|has-|hover|active|focus|elementor-edit-mode|menu-item-\d+)/;
	const stableClass = Array.from(el.classList).find(
		(c) => !unstableClassRegex.test(c),
	);
	const cls = stableClass ? `.${stableClass}` : '';

	const dataAttrs = Array.from(el.attributes)
		.filter((a) => a.name.startsWith('data-'))
		.map((a) => a.name)
		.sort()
		.join(',');
	const data = dataAttrs ? `@${dataAttrs}` : '';

	return `${tag}${id}${cls}${data}`;
};

/**
 * Fetch the same URL as an anonymous visitor and return a parsed Document.
 *
 * @param {string} url
 */
export const fetchPublicDocument = async (url) => {
	if (!url) {
		return null;
	}

	try {
		const response = await fetch(url, {
			credentials: 'omit',
			cache: 'no-store',
			headers: { 'X-EA11y-Public-Scan': '1' },
		});

		if (!response.ok) {
			console.warn(
				`[ea11y] public-DOM fetch failed: ${response.status} ${response.statusText}`,
			);
			return null;
		}

		const contentType = response.headers.get('content-type') || '';
		if (!contentType.includes('html')) {
			console.warn(
				`[ea11y] public-DOM fetch returned non-html content-type: ${contentType}`,
			);
			return null;
		}

		const text = await response.text();
		return new DOMParser().parseFromString(text, 'text/html');
	} catch (e) {
		console.warn('[ea11y] public-DOM fetch threw', e);
		return null;
	}
};

/**
 * Removes admin-only top-level children of <body> that don't appear in the
 * public document.
 *
 * @param {Document} publicDoc
 */
export const normalizeToPublicDom = (publicDoc) => {
	if (!publicDoc || !publicDoc.body || !document.body) {
		return [];
	}

	const publicSignatures = new Set(
		Array.from(publicDoc.body.children).map(buildSignature),
	);

	const nonMarkupTags = new Set([
		'style',
		'script',
		'link',
		'noscript',
		'meta',
		'template',
	]);

	const captured = [];
	const liveChildren = Array.from(document.body.children);

	for (const child of liveChildren) {
		if (child.id === ROOT_ID) {
			continue;
		}

		if (nonMarkupTags.has(child.tagName.toLowerCase())) {
			continue;
		}

		const sig = buildSignature(child);
		if (sig && publicSignatures.has(sig)) {
			continue;
		}

		captured.push({
			node: child,
			parent: document.body,
			nextSibling: child.nextSibling,
		});
	}

	for (const entry of captured) {
		entry.node.remove();
	}

	removedNodes = removedNodes.concat(captured);
	return captured;
};

/**
 * Re-inserts previously-removed nodes at their original positions.
 *
 * @param {Array<{node: Element, parent: Element, nextSibling: Node|null}>} entries
 */
export const restorePublicDomChanges = (entries = removedNodes) => {
	for (const { node, parent, nextSibling } of entries) {
		if (!parent || !parent.isConnected) {
			continue;
		}

		if (nextSibling && nextSibling.parentNode === parent) {
			parent.insertBefore(node, nextSibling);
		} else {
			parent.appendChild(node);
		}
	}
};

export const getRemovedNodes = () => removedNodes;

export const clearRemovedNodes = () => {
	removedNodes = [];
};
