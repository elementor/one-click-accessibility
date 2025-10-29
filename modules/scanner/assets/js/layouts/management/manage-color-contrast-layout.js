import { getDataFromCss } from '@ea11y-apps/global/utils/color-contrast-helpers';
import { ColorContrastForm } from '@ea11y-apps/scanner/components/color-contrast-form';
import { FormNavigation } from '@ea11y-apps/scanner/components/form-navigation';
import { ManageColorContrast } from '@ea11y-apps/scanner/components/manage-color-contrast';
import { BLOCKS } from '@ea11y-apps/scanner/constants';
import { useScannerWizardContext } from '@ea11y-apps/scanner/context/scanner-wizard-context';
import { StyledContent } from '@ea11y-apps/scanner/styles/app.styles';
import { checkContrastAA } from '@ea11y-apps/scanner/utils/calc-color-ratio';
import { getElementByXPath } from '@ea11y-apps/scanner/utils/get-element-by-xpath';
import { useState } from '@wordpress/element';

export const ManageColorContrastLayout = () => {
	const {
		sortedRemediation,
		sortedGlobalRemediation,
		isManageGlobal,
		setOpenedBlock,
	} = useScannerWizardContext();

	const [current, setCurrent] = useState(0);
	const [isEdit, setIsEdit] = useState(false);

	const remediations = isManageGlobal
		? sortedGlobalRemediation
		: sortedRemediation;

	const item = remediations[BLOCKS.colorContrast][current];

	// Prevent to render empty list
	if (!item) {
		void (remediations[BLOCKS.colorContrast].length > 0
			? setCurrent(0)
			: setOpenedBlock(BLOCKS.management));

		return null;
	}

	const data = item?.content ? JSON.parse(item.content) : null;
	const node = data?.xpath ? getElementByXPath(data.xpath) : null;
	const cssData = data?.rule ? getDataFromCss(data.rule) : null;

	const openEdit = () => {
		setIsEdit(true);
	};

	const changeNavigation = (index) => {
		if (index > remediations[BLOCKS.colorContrast].length - 1) {
			setCurrent(0);
		} else {
			setCurrent(index);
		}
	};

	const colorData = node ? checkContrastAA(node) : null;

	return (
		<StyledContent>
			{isEdit ? (
				<ColorContrastForm
					item={{
						id: item.id,
						node,
						data,
						messageArgs: [
							colorData?.ratio,
							'',
							'',
							cssData.color?.value,
							cssData.background?.value,
						],
						path: { dom: data?.xpath },
						isEdit,
						isPotential: colorData?.isPotential,
						parentNode: cssData.background?.item,
						global: item.global === '1',
					}}
					current={current}
					setCurrent={changeNavigation}
					setIsEdit={setIsEdit}
				/>
			) : (
				<ManageColorContrast
					item={item}
					node={node}
					color={cssData.color}
					background={cssData.background}
					current={current}
					openEdit={openEdit}
				/>
			)}
			<FormNavigation
				total={remediations[BLOCKS.colorContrast].length}
				current={current}
				setCurrent={changeNavigation}
			/>
		</StyledContent>
	);
};
