import { Suspense } from '@wordpress/element';
import SettingsLoader from './page-content-loader';

const PageContent = ({ isLoading, page }) => {
	if (isLoading) {
		return <SettingsLoader />;
	}

	return <Suspense fallback={<SettingsLoader />}>{page}</Suspense>;
};

export default PageContent;
