/**
 * Created by Administrator on 2017/2/6.
 */
define(['require', 'angular', 'router'], function (require, angular) {
	var app = angular.module('myApp', ['ui.router']);
	app.config(function ($controllerProvider) {
		app.register = {
			controller: $controllerProvider.register
		};
	});
	app.config(function ($stateProvider, $urlRouterProvider) {
		$urlRouterProvider.otherwise('home');
		$stateProvider
			.state('home', {
				url: '/home',
				templateUrl: 'module/home/home.html',
				controller: 'homeCtrl',
				resolve: loadJs(['../../module/home/homeCtrl'])
			})
			.state('appointments', {
				url: '/appointments',
				templateUrl: 'module/appointments/appointments.html',
				controller: 'appCtrl',
				resolve: loadJs(['../../module/appointments/appCtrl'])
			})
			.state('schedule', {
				url: '/schedule',
				templateUrl: 'module/schedule/schedule.html',
				controller: 'schCtrl',
				resolve: loadJs(['../../module/schedule/schCtrl'])
			})
			.state('sessionHistory', {
				url: '/sessionHistory',
				templateUrl: 'module/sessionHistory/sessionHistory.html',
				controller: 'sessCtrl',
				resolve: loadJs(['../../module/sessionHistory/sessHisCtrl'])
			})
			.state('lanArt', {
				url: '/languageArt',
				templateUrl: 'module/languageArt/languageArt.html',
				controller: 'lanArtCtrl',
				resolve: loadJs(['../../module/languageArt/lanArtCtrl'])
			})
			.state('lanArtDemo', {
				url: '/languageArtDemo',
				controller: 'lanArtCtrl',
				templateUrl: 'module/languageArt/languageArtDemo.html',
				resolve: loadJs(['../../module/languageArt/lanArtCtrl'])
			})
			.state('picbook', {
				url: '/pictureBook',
				templateUrl: 'module/pictureBook/pictureBook.html',
				controller: 'pictureBookCtrl',
				resolve: loadJs(['../../module/pictureBook/pictureBook'])
			})
			.state('picBookDemo', {
				url: '/pictureBookDemo',
				templateUrl: 'module/pictureBook/pictureBookDemo.html',
				controller: 'pictureBookCtrl',
				resolve: loadJs(['../../module/pictureBook/pictureBook'])
			})
			.state('science', {
				url: '/science',
				templateUrl: 'module/science/science.html',
				controller: "sciCtrl",
				resolve: loadJs(["../../module/science/sciCtrl"])

			})
			.state('scienceDemo', {
				url: '/scienceDemo',
				templateUrl: 'module/science/scienceDemo.html',
				controller: "sciDemoCtrl",
				resolve: loadJs(["../../module/science/sciCtrl"])
			})
			.state('socStu', {
				url: '/socialStudy',
				templateUrl: 'module/socialStudy/socialStudy.html',
				controller: "socialStudyCtrl",
				resolve: loadJs(["../../module/socialStudy/socialStudyCtrl"])
			})
			.state('socStuDemo', {
				url: '/socialStudyDemo',
				templateUrl: 'module/socialStudy/socialStudyDemo.html',
				controller: "socialStudyCtrl",
				resolve: loadJs(["../../module/socialStudy/socialStudyCtrl"])

			})
			.state('lanArtView', {
				url: '/languageArtView',
				templateUrl: 'module/languageArt/languageArtView.html',
				controller: 'lanArtViewCtrl',
				resolve: loadJs(['../../module/languageArt/lanArtViewCtrl'])
			})
			.state('lanArtDemoView', {
				url: '/languageArtDemoView',
				controller: 'lanArtViewCtrl',
				templateUrl: 'module/languageArt/languageArtDemoView.html',
				resolve: loadJs(['../../module/languageArt/lanArtViewCtrl'])
			})
			.state('picbookView', {
				url: '/pictureBookView',
				templateUrl: 'module/pictureBook/pictureBookView.html',
				controller: 'pictureBookViewCtrl',
				resolve: loadJs(['../../module/pictureBook/pictureBookView'])
			})
			.state('picBookDemoView', {
				url: '/pictureBookDemoView',
				templateUrl: 'module/pictureBook/pictureBookDemoView.html',
				controller: 'pictureBookViewCtrl',
				resolve: loadJs(['../../module/pictureBook/pictureBookView'])
			})
			.state('scienceView', {
				url: '/scienceView',
				templateUrl: 'module/science/scienceView.html',
				controller: "sciViewCtrl",
				resolve: loadJs(["../../module/science/sciViewCtrl"])

			})
			.state('scienceDemoView', {
				url: '/scienceDemoView',
				templateUrl: 'module/science/scienceDemoView.html',
				controller: "sciViewCtrl",
				resolve: loadJs(["../../module/science/sciViewCtrl"])
			})
			.state('socStuView', {
				url: '/socialStudyView',
				templateUrl: 'module/socialStudy/socialStudyView.html',
				controller: "socialStudyViewCtrl",
				resolve: loadJs(["../../module/socialStudy/socialStudyViewCtrl"])
			})
			.state('socStuDemoView', {
				url: '/socialStudyDemoView',
				templateUrl: 'module/socialStudy/socialStudyDemoView.html',
				controller: "socialStudyViewCtrl",
				resolve: loadJs(["../../module/socialStudy/socialStudyViewCtrl"])
			})
			.state('personalInfoView', {
				url: '/personalInfoView/:id',
				templateUrl: 'module/personalInfo/myInfo.html',
				controller: "personalInfoViewCtrl",
				resolve: loadJs(["../../module/personalInfo/myInfoCtrl"])
			})
            .state('paymentView', {
                url: '/paymentView',
                templateUrl: 'module/payment/payment.html',
                controller: "paymentViewCtrl",
                resolve: loadJs(["../../module/payment/paymentCtrl"])
            })
			.state('messageView', {
				url: '/messageView',
				templateUrl: 'module/message/message.html',
				controller: "messageViewCtrl",
				resolve: loadJs(["../../module/message/messageCtrl"])
			})
			.state('msgFromI2View', {
				url: '/msgFromI2View',
				templateUrl: 'module/message/msgFromI2.html',
				controller: "msgFromI2ViewCtrl",
				resolve: loadJs(["../../module/message/messageCtrl"])
			})
			.state('msgFromStudentView', {
				url: '/msgFromStudentView/:id',
				templateUrl: 'module/message/msgFromStudent.html',
				controller: "msgFromStudentViewCtrl",
				resolve: loadJs(["../../module/message/messageCtrl"])
			})
	});
	return app;

	function loadJs(js) {
		return {
			loadCtrl: ['$q', function ($q) {
				var deferred = $q.defer();
				require(js, function () {
					deferred.resolve();
				});
				return deferred.promise;
			}]
		}
	}
});