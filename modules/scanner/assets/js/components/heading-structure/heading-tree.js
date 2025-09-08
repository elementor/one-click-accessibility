import HeadingStructureHeadingTreeList from '@ea11y-apps/scanner/components/heading-structure/heading-tree-list';
import HeadingStructureHeadingTreeListItem from '@ea11y-apps/scanner/components/heading-structure/heading-tree-list-item';
import HeadingStructureHeadingTreeLoader from '@ea11y-apps/scanner/components/heading-structure/heading-tree-loader';
import { useHeadingStructureContext } from '@ea11y-apps/scanner/context/heading-structure-context';
import { useEffect } from '@wordpress/element';

const HeadingStructureHeadingTree = () => {
	const { isLoading, pageHeadings, updateHeadingsTree } =
		useHeadingStructureContext();

	useEffect(() => {
		updateHeadingsTree();
	}, []);

	/**
	 * @param {import('../../types/heading').Ea11yHeading[]} headings
	 * @param {number | false}                               nestedId
	 * @return {JSX.Element} React element to render.
	 */
	const renderPageHeadings = (headings, nestedId) => {
		const children = headings.flatMap((heading, i) => {
			const item = (
				<HeadingStructureHeadingTreeListItem
					key={`heading-structure-${i}`}
					level={heading.level}
					content={heading.content}
					node={heading.node}
					status={heading.status}
					violation={heading.violationCode}
				/>
			);

			if (heading.children.length) {
				const subHeaders = renderPageHeadings(heading.children, i);

				return [item, subHeaders];
			}

			return [item];
		});

		const list = <HeadingStructureHeadingTreeList children={children} />;

		if (false !== nestedId) {
			return <li key={`heading-structure-${nestedId}-nested`}>{list}</li>;
		}

		return list;
	};

	if (!pageHeadings.length && isLoading) {
		return <HeadingStructureHeadingTreeLoader />;
	}

	return renderPageHeadings(pageHeadings, false);
};

export default HeadingStructureHeadingTree;
