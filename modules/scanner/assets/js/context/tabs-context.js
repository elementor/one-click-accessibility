import useTabs from '@elementor/ui/useTabs';
import PropTypes from 'prop-types';
import { mixpanelEvents, mixpanelService } from '@ea11y-apps/global/services';
import { BLOCKS } from '@ea11y-apps/scanner/constants';
import { useScannerWizardContext } from '@ea11y-apps/scanner/context/scanner-wizard-context';
import { getInitialTab } from '@ea11y-apps/scanner/utils/get-initial-tab';
import { createContext, useContext } from '@wordpress/element';

export const TabsContext = createContext({});

export const TabsContextProvider = ({ children }) => {
	const { setOpenedBlock, setIsManage } = useScannerWizardContext();
	const { getTabsProps, getTabProps, getTabPanelProps } =
		useTabs(getInitialTab());

	const tabsProps = getTabsProps();

	const changeTab = (event, newValue) => {
		setOpenedBlock(newValue);
		setIsManage(newValue === BLOCKS.management);
		tabsProps.onChange(event, newValue);
		mixpanelService.sendEvent(mixpanelEvents.tabSelected, {
			tab_name: newValue,
		});
	};

	return (
		<TabsContext.Provider
			value={{
				tabsProps: {
					value: tabsProps.value,
					onChange: changeTab,
				},
				getTabProps,
				getTabPanelProps,
			}}
		>
			{children}
		</TabsContext.Provider>
	);
};

TabsContextProvider.propTypes = {
	children: PropTypes.node,
};

export const useTabsContext = () => {
	return useContext(TabsContext);
};
