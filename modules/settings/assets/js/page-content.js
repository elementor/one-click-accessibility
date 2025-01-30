import SettingsLoader from './page-content-loader';

const PageContent = ({ isLoading, page }) => {
	if (isLoading) {
		return <SettingsLoader />;
	}

	return page;
};

export default PageContent;
