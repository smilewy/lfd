/**
 * Created by Administrator on 2017/2/8.
 */
var baseUrl = '/lfd_fts';
define(['route'], function (app) {
	app.service('_ajax', function ($http) {
		// var baseUrl = '';
		this.get = function (url, params, callback) {
			$http({
				method: 'GET',
				url: baseUrl + url,
				params: params
			}).then(function (response) {
				var res = response.data;
				if (res.resultCode == '40002') {
					location.href = '/lfd_web/offcial/pages/en-index.html'
				} else if (res.resultCode == '0') {
					if (typeof callback == 'function') {
						callback(res)
					}
				} else {
					alert(res.resultMsg)
				}
			}, function (response) {
				alert(response.data)
			})
		};
		this.post = function (url, params, callback) {
			$http({
				method: 'POST',
				url: baseUrl + url,
				data: params
			}).then(function (response) {
				var res = response.data;
				if (res.resultCode == '40002') {
					location.href = '/lfd_web/offcial/pages/en-index.html'
				} else if (res.resultCode == '0') {
					if (typeof callback == 'function') {
						callback(res)
					}
				} else {
					alert(res.resultMsg)
				}
			}, function (response) {
				alert(response.message)
			})
		}
	})
});