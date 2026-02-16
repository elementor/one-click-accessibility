import { lazy } from '@wordpress/element';

// Lazy-load chart components to split @mui/x-charts into separate webpack chunks
export const LineChart = lazy(() =>
	import(/* webpackChunkName: "charts-analytics" */ './line-chart').then(
		(module) => ({ default: module.LineChart }),
	),
);

export const PieChart = lazy(() =>
	import(/* webpackChunkName: "charts-analytics" */ './pie-chart').then(
		(module) => ({ default: module.PieChart }),
	),
);

export { UsageTable } from './usage-table';
