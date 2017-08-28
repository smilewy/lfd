/**
 * Created by Administrator on 2017/2/6.
 */
var config = {
	baseUrl: '/lfd_fts/assets/js',
	// baseUrl: '/assets/js',
	paths: {
		jquery: 'libs/jquery/jquery-3.1.1.min',
		angular: 'libs/angular/angular.min',
		router: 'libs/angular/angular-ui-router.min',
		bootstrap: 'libs/bootstrap-3.3.7/js/bootstrap.min',
		datetimepicker: 'libs/datetimepicker/js/bootstrap-datetimepicker.min',
		swiper: 'libs/swiper/swiper.jquery.min',
		highcharts: 'libs/Highcharts-5.0.7/highcharts',
		cropper: 'libs/cropper/cropper.min'
	},
	// urlArgs: "?bust=" + (new Date()).getTime(),
	shim: {
		angular: {
			exports: 'angular'
		},
		router: {
			deps: ['angular']
		},
		bootstrap: {
			deps: ['jquery']
		},
		datetimepicker: {
			deps: ['jquery']
		},
		swiper: {
			deps: ['jquery']
		},
		highcharts: {
			deps: ['jquery'],
			exports: 'Highcharts'
		},
		cropper: {
			deps: ['jquery']
		}
	}
};
requirejs(config);

requirejs(['angular', 'service', 'directive', 'filter', 'index'], function (angular) {
	angular.bootstrap(document, ['myApp']);
});