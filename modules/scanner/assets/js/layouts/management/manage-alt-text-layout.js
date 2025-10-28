import { AltTextForm } from '@ea11y-apps/scanner/components/alt-text-form';
import { FormNavigation } from '@ea11y-apps/scanner/components/form-navigation';
import { ManageAltText } from '@ea11y-apps/scanner/components/manage-alt-text';
import { BLOCKS } from '@ea11y-apps/scanner/constants';
import { useScannerWizardContext } from '@ea11y-apps/scanner/context/scanner-wizard-context';
import { StyledContent } from '@ea11y-apps/scanner/styles/app.styles';
import { getElementByXPath } from '@ea11y-apps/scanner/utils/get-element-by-xpath';
import { useState } from '@wordpress/element';

export const ManageAltTextLayout = () => {
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

	const item = remediations[BLOCKS.altText][current];

	// Prevent to render empty list
	if (!item) {
		void (remediations[BLOCKS.altText].length > 0
			? setCurrent(0)
			: setOpenedBlock(BLOCKS.management));

		return null;
	}

	const openEdit = () => {
		setIsEdit(true);
	};

	const changeNavigation = (index) => {
		if (index > remediations[BLOCKS.altText].length - 1) {
			setCurrent(0);
		} else {
			setCurrent(index);
		}
	};

	const data = JSON.parse(item?.content || '');
	const node = getElementByXPath(data?.xpath);

	return (
		<StyledContent>
			{isEdit ? (
				<AltTextForm
					item={{
						id: item.id,
						node,
						data,
						path: { dom: data?.xpath },
						global: item.global === '1',
					}}
					current={current}
					setCurrent={changeNavigation}
					setIsEdit={setIsEdit}
				/>
			) : (
				<ManageAltText item={item} current={current} openEdit={openEdit} />
			)}
			<FormNavigation
				total={remediations.altText.length}
				current={current}
				setCurrent={changeNavigation}
			/>
		</StyledContent>
	);
};
