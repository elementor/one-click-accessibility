import HeadingStructureHeadingTreeList from '@ea11y-apps/scanner/components/heading-structure/heading-tree-list';
import HeadingStructureHeadingTreeListItem from '@ea11y-apps/scanner/components/heading-structure/heading-tree-list-item';
import { getPageHeadings } from '@ea11y-apps/scanner/utils/page-headings';

const HeadingStructureHeadingTree = () => {
	const pageHeadings = getPageHeadings();

	const renderPageHeadings = (headings, nested) => {
		const children = headings.flatMap((heading, i) => {
			const item = (
				<HeadingStructureHeadingTreeListItem
					key={`heading-structure-${i}`}
					level={heading.level}
					content={heading.content}
				/>
			);

			if (heading.children.length) {
				const subHeaders = renderPageHeadings(heading.children, true);

				return [item, subHeaders];
			}

			return [item];
		});

		const list = <HeadingStructureHeadingTreeList children={children} />;

		if (nested) {
			return <li>{list}</li>;
		}

		return list;
	};

	return renderPageHeadings(pageHeadings);
};

export default HeadingStructureHeadingTree;
