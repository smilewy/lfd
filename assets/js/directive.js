/**
 * Created by Administrator on 2017/2/8.
 */
define(['angular', 'route'], function (angular, app) {
	app.directive('tmPagination', function () {
		return {
			restrict: 'EA',
			template: '<div class="page-list">' +
			'<span class="pagination-total" ng-class="{true: \'\', false: \'no-data\'}[conf.totalItems != 0]" ng-show="conf.showTotal">Threr are {{conf.totalItems}}</span>' +
			'<ul class="pagination" ng-show="conf.totalItems > 0">' +
			'<li ng-class="{disabled: conf.currentPage == 1}" ng-click="prevPage()"><span>{{conf.prevBtn}}</span></li>' +
			'<li ng-repeat="item in pageList track by $index" ng-class="{active: item == conf.currentPage, separate: item == \'...\'}" ' +
			'ng-click="changeCurrentPage(item)">' +
			'<span>{{ item }}</span>' +
			'</li>' +
			'<li ng-class="{disabled: conf.currentPage == conf.numberOfPages}" ng-click="nextPage()"><span>{{conf.nextBtn}}</span></li>' +
			'</ul>' +
			'<div class="no-items" ng-show="conf.totalItems <= 0">No message</div>' +
			'</div>',
			replace: true,
			scope: {
				conf: '='
			},
			link: function (scope, element, attrs) {

				var conf = scope.conf;

				// 默认分页长度
				var defaultPagesLength = 9;

				// 默认分页选项可调整每页显示的条数
				var defaultPerPageOptions = [10, 15, 20, 30, 50];
				conf.perPageOptions = [];
				// 默认每页的个数
				var defaultPerPage = 15;

				// 获取分页长度
				if (conf.pagesLength) {
					// 判断一下分页长度
					conf.pagesLength = parseInt(conf.pagesLength, 10);

					if (!conf.pagesLength) {
						conf.pagesLength = defaultPagesLength;
					}

					// 分页长度必须为奇数，如果传偶数时，自动处理
					if (conf.pagesLength % 2 === 0) {
						conf.pagesLength += 1;
					}

				} else {
					conf.pagesLength = defaultPagesLength
				}

				// 分页选项可调整每页显示的条数
				if (!conf.perPageOptions) {
					conf.perPageOptions = defaultPagesLength;
				}

				// pageList数组
				function getPagination(newValue, oldValue) {

					// conf.currentPage
					if (conf.currentPage) {
						conf.currentPage = parseInt(scope.conf.currentPage, 10);
					}

					if (!conf.currentPage) {
						conf.currentPage = 1;
					}

					// conf.totalItems
					if (conf.totalItems) {
						conf.totalItems = parseInt(conf.totalItems, 10);
					}

					// conf.totalItems
					if (!conf.totalItems) {
						conf.totalItems = 0;
						return;
					}

					// conf.itemsPerPage
					if (conf.itemsPerPage) {
						conf.itemsPerPage = parseInt(conf.itemsPerPage, 10);
					}
					if (!conf.itemsPerPage) {
						conf.itemsPerPage = defaultPerPage;
					}

					// numberOfPages
					conf.numberOfPages = Math.ceil(conf.totalItems / conf.itemsPerPage);

					// 如果分页总数>0，并且当前页大于分页总数
					if (scope.conf.numberOfPages > 0 && scope.conf.currentPage > scope.conf.numberOfPages) {
						scope.conf.currentPage = scope.conf.numberOfPages;
					}

					// 如果itemsPerPage在不在perPageOptions数组中，就把itemsPerPage加入这个数组中
					var perPageOptionsLength = scope.conf.perPageOptions.length;

					// 定义状态
					var perPageOptionsStatus;
					for (var i = 0; i < perPageOptionsLength; i++) {
						if (conf.perPageOptions[i] == conf.itemsPerPage) {
							perPageOptionsStatus = true;
						}
					}
					// 如果itemsPerPage在不在perPageOptions数组中，就把itemsPerPage加入这个数组中
					if (!perPageOptionsStatus) {
						conf.perPageOptions.push(conf.itemsPerPage);
					}

					// 对选项进行sort
					conf.perPageOptions.sort(function (a, b) {
						return a - b
					});


					// 页码相关
					scope.pageList = [];
					if (conf.numberOfPages <= conf.pagesLength) {
						// 判断总页数如果小于等于分页的长度，若小于则直接显示
						for (i = 1; i <= conf.numberOfPages; i++) {
							scope.pageList.push(i);
						}
					} else {
						// 总页数大于分页长度（此时分为三种情况：1.左边没有...2.右边没有...3.左右都有...）
						// 计算中心偏移量
						var offset = (conf.pagesLength - 1) / 2;
						if (conf.currentPage <= offset) {
							// 左边没有...
							for (i = 1; i <= offset + 1; i++) {
								scope.pageList.push(i);
							}
							scope.pageList.push('...');
							scope.pageList.push(conf.numberOfPages);
						} else if (conf.currentPage > conf.numberOfPages - offset) {
							scope.pageList.push(1);
							scope.pageList.push('...');
							for (i = offset + 1; i >= 1; i--) {
								scope.pageList.push(conf.numberOfPages - i);
							}
							scope.pageList.push(conf.numberOfPages);
						} else {
							// 最后一种情况，两边都有...
							scope.pageList.push(1);
							scope.pageList.push('...');

							for (i = Math.ceil(offset / 2); i >= 1; i--) {
								scope.pageList.push(conf.currentPage - i);
							}
							scope.pageList.push(conf.currentPage);
							for (i = 1; i <= offset / 2; i++) {
								scope.pageList.push(conf.currentPage + i);
							}

							scope.pageList.push('...');
							scope.pageList.push(conf.numberOfPages);
						}
					}

					scope.$parent.conf = conf;
				}

				// prevPage
				scope.prevPage = function () {
					if (conf.currentPage != 1) {
						if (conf.onChange) {
							conf.onChange();
						}
					}
					if (conf.currentPage > 1) {
						conf.currentPage -= 1;
					}
					getPagination();
				};

				// nextPage
				scope.nextPage = function () {
					if (conf.currentPage != conf.numberOfPages) {
						if (conf.onChange) {
							conf.onChange();
						}
					}
					if (conf.currentPage < conf.numberOfPages) {
						conf.currentPage += 1;
					}
					getPagination();
				};

				// 变更当前页
				scope.changeCurrentPage = function (item) {

					if (item == '...') {
						return;
					} else {
						conf.currentPage = item;
						getPagination();
						// conf.onChange()函数
						if (conf.onChange) {
							conf.onChange();
						}
					}
				};

				scope.$watch('conf.totalItems', function (value, oldValue) {

					// 在无值或值相等的时候，去执行onChange事件
					if (value == undefined && oldValue == undefined) {

						if (conf.onChange) {
							conf.onChange();
						}
					}
					getPagination();
				})
			}
		};
	})
		.directive('star', function () {
			return {
				template: '<ul class="rating">' +
				'<li ng-repeat="star in stars" ng-class="star" ng-click="clickStar($index + 1)">' +
				'\u2605' +
				'</li>' +
				'</ul>',
				scope: {
					ratingValue: '=',
					max: '=',
					readonly: '@'
				},
				link: function (scope, elem, attrs) {
					// scope.ratingValue = scope.max;
					elem.css("text-align", "center");
					var updateStars = function () {
						scope.stars = [];
						for (var i = 0; i < scope.max; i++) {
							scope.stars.push({
								filled: i < scope.ratingValue
							});
						}
					};
					updateStars();

					scope.clickStar = function (num) {
						if (scope.readonly == 'true') {
							return false
						}
						scope.ratingValue = num;
					};

					scope.$watch('ratingValue', function (newVal) {
						if (newVal) {
							updateStars();
						}
					});
				}
			};
		})
		.directive("fileread", [function () {
			return {
				scope: {
					fileread: "="
				},
				link: function (scope, element, attributes) {
					element.bind("change", function (changeEvent) {
						scope.$apply(function () {
							scope.fileread = changeEvent.target.files[0];
							// or all selected files:
							// scope.fileread = changeEvent.target.files;
						});
					});
				}
			}
		}]);
});