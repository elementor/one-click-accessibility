import { getDataFromCss } from '@ea11y-apps/global/utils/color-contrast-helpers';
import { ColorContrastForm } from '@ea11y-apps/scanner/components/color-contrast-form';
import { FormNavigation } from '@ea11y-apps/scanner/components/form-navigation';
import { ManageColorContrast } from '@ea11y-apps/scanner/components/manage-color-contrast';
import {
	BACKGROUND_ELEMENT_CLASS,
	BLOCKS,
} from '@ea11y-apps/scanner/constants';
import { useScannerWizardContext } from '@ea11y-apps/scanner/context/scanner-wizard-context';
import { StyledContent } from '@ea11y-apps/scanner/styles/app.styles';
import { checkContrastAA } from '@ea11y-apps/scanner/utils/calc-color-ratio';
import { focusOnElement } from '@ea11y-apps/scanner/utils/focus-on-element';
import { getElementByXPath } from '@ea11y-apps/scanner/utils/get-element-by-xpath';
import { useEffect, useState } from '@wordpress/element';

export const ManageColorContrastLayout = () => {
	const { sortedRemediation, setOpenedBlock } = useScannerWizardContext();

	useEffect(() => {
		if (!item) {
			setOpenedBlock(BLOCKS.management);
		}
	});

	const [current, setCurrent] = useState(0);
	const [isEdit, setIsEdit] = useState(false);

	const item = sortedRemediation[BLOCKS.colorContrast][current];
	const data = JSON.parse(item?.content);
	const node = getElementByXPath(data?.xpath);
	const cssData = getDataFromCss(data.rule);
	const colorData = checkContrastAA(node);

	useEffect(() => {
		focusOnElement(node);
	}, [node]);

	useEffect(() => {
		if (cssData.background?.item) {
			focusOnElement(cssData.background?.item, BACKGROUND_ELEMENT_CLASS);
		}
	}, [cssData.background.item]);

	const openEdit = () => {
		setIsEdit(true);
	};

	const changeNavigation = (index) => {
		if (index > sortedRemediation[BLOCKS.colorContrast].length - 1) {
			setCurrent(0);
		} else {
			setCurrent(index);
		}
	};

	return (
		<StyledContent>
			{isEdit ? (
				<ColorContrastForm
					item={{
						id: item.id,
						node,
						data,
						messageArgs: [
							colorData.ratio,
							'',
							'',
							cssData.color?.value,
							cssData.background?.value,
						],
						path: { dom: data?.xpath },
						isEdit,
						isPotential: colorData.isPotential,
						parentNode: cssData.background?.item,
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
				total={sortedRemediation[BLOCKS.colorContrast].length}
				current={current}
				setCurrent={changeNavigation}
			/>
		</StyledContent>
	);
};
