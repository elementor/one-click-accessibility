import { AltTextForm } from '@ea11y-apps/scanner/components/alt-text-form';
import { FormNavigation } from '@ea11y-apps/scanner/components/form-navigation';
import { ManageAltText } from '@ea11y-apps/scanner/components/manage-alt-text';
import { BLOCKS } from '@ea11y-apps/scanner/constants';
import { useScannerWizardContext } from '@ea11y-apps/scanner/context/scanner-wizard-context';
import { StyledContent } from '@ea11y-apps/scanner/styles/app.styles';
import { getElementByXPath } from '@ea11y-apps/scanner/utils/get-element-by-xpath';
import { useEffect, useState } from '@wordpress/element';

export const ManageAltTextLayout = () => {
	const { sortedRemediation, setOpenedBlock } = useScannerWizardContext();
	const [current, setCurrent] = useState(0);
	const [isEdit, setIsEdit] = useState(false);

	useEffect(() => {
		if (!item) {
			setOpenedBlock(BLOCKS.management);
		}
	});

	const item = sortedRemediation[BLOCKS.altText][current];
	const data = JSON.parse(item.content);
	const node = getElementByXPath(data.xpath);

	const openEdit = () => {
		setIsEdit(true);
	};

	const changeNavigation = (index) => {
		if (index > sortedRemediation[BLOCKS.altText].length - 1) {
			setCurrent(0);
		} else {
			setCurrent(index);
		}
	};

	return (
		<StyledContent>
			{isEdit ? (
				<AltTextForm
					item={{
						id: item.id,
						node,
						data,
					}}
					current={current}
					setCurrent={changeNavigation}
					setIsEdit={setIsEdit}
				/>
			) : (
				<ManageAltText item={item} current={current} openEdit={openEdit} />
			)}
			<FormNavigation
				total={sortedRemediation.altText.length}
				current={current}
				setCurrent={changeNavigation}
			/>
		</StyledContent>
	);
};
