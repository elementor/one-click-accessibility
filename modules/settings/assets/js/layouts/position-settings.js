import { DesktopIcon, MobileIcon } from '@elementor/icons';
import Box from '@elementor/ui/Box';
import Grid from '@elementor/ui/Grid';
import Tab from '@elementor/ui/Tab';
import TabPanel from '@elementor/ui/TabPanel';
import Tabs from '@elementor/ui/Tabs';
import Typography from '@elementor/ui/Typography';
import useTabs from '@elementor/ui/useTabs';
import { useState } from '@wordpress/element';
import { __ } from '@wordpress/i18n';
import { PositionSettingsDesktop } from '../layouts';

const TABS = {
	one: 'one',
	two: 'two',
};

const PositionSettings = ( props ) => {
	const [ currentTab, setCurrentTab ] = useState( TABS.one );
	const { getTabProps } = useTabs( currentTab );

	const changeTab = ( tab ) => () => {
		setCurrentTab( tab );
	};

	return (
		<Grid padding={ 2 }
			border={ 1 }
			borderColor="divider"
			{ ...props }>
			<Box marginBottom={ 2 }>
				<Typography variant="subtitle1">{ __( 'Position', 'pojo-accessibility' ) }</Typography>
				<Typography variant="body2">{ __( 'Set where the widget appears on your site. This applies to all pages.', 'pojo-accessibility' ) }</Typography>
			</Box>
			<Box>
				<Tabs
					value={ currentTab }
					sx={ { borderBottom: 'none' } }
					indicatorColor="secondary"
					textColor="secondary"
				>
					<Tab
						{ ...getTabProps( TABS.one ) }
						label="Desktop"
						icon={ <DesktopIcon /> }
						iconPosition="start"
						onClick={ changeTab( TABS.one ) }
					/>
					<Tab
						{ ...getTabProps( TABS.two ) }
						label="Mobile"
						icon={ <MobileIcon /> }
						iconPosition="start"
						onClick={ changeTab( TABS.two ) }
					/>
				</Tabs>
			</Box>

			{ currentTab === TABS.one ? (
				<TabPanel>
					<PositionSettingsDesktop />
				</TabPanel>
			) : (
				<TabPanel >
				</TabPanel>
			) }
		</Grid>
	);
};

export default PositionSettings;