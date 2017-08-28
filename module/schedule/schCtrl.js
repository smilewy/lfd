/**
 * Created by Administrator on 2017/2/6.
 */
define(['jquery', 'route', 'datetimepicker'], function ($, app) {
	app.register.controller('schCtrl', ['$scope', '$timeout', '$filter', '_ajax', function ($scope, $timeout, $filter, _ajax) {
		var clen = 7;	// 天数长度
		var currentFirstDate;	// 当前周第一天的时间
		$scope.editAva = true;	// 是否可编辑 true为不可编辑

		// 获取上课时段
		_ajax.get('/teacherClassTime/base/time/list', {dateArea: getArea()}, function (res) {
			$scope.timeArea = res.resultData
		});
		// 查询老师已设置约课总数
		_ajax.get('/teacher/teacher/getTeacherClassTimeCount', {}, function (res) {
			$scope.firstSet = res.resultData == 0;	// 是否第一次安排课表 true为是
			if ($scope.firstSet) {
				$scope.editAva = false;
			}
		});

		$scope.note = function () {
			alert('1.You will have to set up your available times once a week.\n\n' +
				'2.You can edit the future available times for the forthcoming weeks if you haven’t set up your schedule yet.\n\n' +
				'3.However you can’t edit your available times for the past week, current week or next week once set. The‘Edit availability’button will show a gray invalid status for these weeks.\n\n' +
				'4.We strongly recommend that you set up your available weeks in advance as much as possible so that our students may choose you as a regular study partner.')
		};

		var thisWeek = setDate(new Date());		// 本周时间array
		var nextWeek = setDate(addDate(new Date(), 7), true);		// 当前时间的下周时间array
		var weekObj = getTime(nextWeek[nextWeek.length - 1].dateTime);	// 当前时间的下周最后一天的obj

		$scope.week = thisWeek;
		$scope.params = {
			timeZone: getArea(),	// 老师所在时区
			weekStartDate: '',  // 老师对应周开始时间(哪一天，老师对应时间时区) eg 2017-2-10
			weekEndDate: '',    // 老师对应周结束时间(哪一天，老师对应时间时区) eg 2017-2-10
			teacherDayTimeVoList: []
		};
		appointment();

		// 上一周
		$scope.prevWeek = function () {
			$scope.week = setDate(addDate(currentFirstDate, -7));
			if ($scope.firstSet != undefined && $scope.firstSet) {
				$scope.editAva = getTime($scope.week[$scope.week.length - 1].dateTime) < getTime(thisWeek[thisWeek.length - 1].dateTime);
			} else {
				$scope.editAva = getTime($scope.week[$scope.week.length - 1].dateTime) <= weekObj;
			}
			appointment();
		};
		// 下一周
		$scope.nextWeek = function () {
			$scope.week = setDate(addDate(currentFirstDate, 7));
			if ($scope.firstSet != undefined && $scope.firstSet) {
				$scope.editAva = getTime($scope.week[$scope.week.length - 1].dateTime) < getTime(thisWeek[thisWeek.length - 1].dateTime);
			} else {
				$scope.editAva = new Date($scope.week[$scope.week.length - 1].dateTime).getTime() <= weekObj;
			}
			appointment();
		};

		$('#datetimepicker').datetimepicker({
			minView: 2,
			maxView: 2
		});
		// 默认单选框值
		$scope.course = {
			edit: 'available'
		};
		// 初始化自定义单选框选中样式
		$scope.editType = {
			available: true,
			unavailable: false
		};
		//自定义单选框选中效果
		$scope.editCourse = function (str) {
			switch (str) {
				case 'available':
					$scope.editType.available = true;
					$scope.editType.unavailable = false;
					break;
				case 'unavailable':
					$scope.editType.available = false;
					$scope.editType.unavailable = true;
					break;
				default:
					$scope.editType.available = true;
					$scope.editType.unavailable = false;
			}
		};
		// 开启编辑模式
		$scope.edit = function () {
			$scope.showEdit = true;
			$scope.isEdit = true
		};
		// 关闭编辑模式
		$scope.close = function () {
			$scope.showEdit = false;
			$scope.isEdit = false;
			// 默认自定义单选框效果
			$scope.editType.available = true;
			$scope.editType.unavailable = false;
			$scope.course.edit = 'available';	// 默认选项为可用单选框
			$scope.params.teacherDayTimeVoList = [];	// 初始化请求数据
			$(".table-div-tr").find("li").removeClass("selected");
			appointment()
		};
		// 选中时间节点
		$scope.seltimeArea = function (event) {
			if ($scope.showEdit) {
				var node = $(event.target),
					hasDiv = node.hasClass('hasdiv');
				if (hasDiv) {
					node = node.parent();
					node.addClass('selected');
					node.children().remove()
				}
				var dateTime = node.parent().data('dateTime'),
					id = node.data('id'),
					startDate = node.data('timeArea');
				if ($scope.course.edit == 'available') {
					node.addClass('selected');
					addTimeCourse(dateTime, id, startDate)
				} else {
					node.removeClass('selected');
					removeTimeCourse(dateTime, id);
				}
			}
		};

		$scope.save = function () {
			_ajax.post('/teacherClassTime/set/lessonTime', $scope.params, function (res) {
				$scope.params.teacherDayTimeVoList = [];	// 初始化请求数据
				$scope.showEdit = false;	// 关闭修改选项
				$scope.isEdit = false;	// 取消上一周、下一周按钮的禁用
				$scope.course.edit = 'available';	// 默认选项为可用单选框
				// 默认自定义单选框效果
				$scope.editType.available = true;
				$scope.editType.unavailable = false;
				appointment();
			});
		};
		// 筛选学生
		$scope.selectStudent = selectStudent;

		// 点击学生名字查看详情
		$scope.seeStudent = function (obj) {
			$scope.showInfo = true;
			_ajax.get('/lesson/viewStudent/' + obj.idUser, '', function (res) {
				var data = res.resultData;
				if (data.enRemark) {
					if (data.enRemark.length > 240) {
						data.enRemarkStr = $filter('limitTo')(data.enRemark, 240) + '...'
					} else {
						data.enRemarkStr = data.enRemark
					}
				} else {
					data.enRemarkStr = ''
				}
				$scope.newListStudentDetail = data;
				$scope.newListStudentDetail.obj = obj;
			})
		};
		// 关闭学生信息弹窗
		$scope.closeNewStudentDetail = function () {
			$scope.showInfo = false;
		};

		// 格式化时间，并返回obj
		function formatDate(date) {
			var day = date.getDate();
			var month = date.getMonth() + 1;
			var year = date.getFullYear();
			var week = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'][date.getDay()];
			month = month < 10 ? '0' + month : month;
			day = parseInt(day) < 10 ? '0' + day : day;
			return {
				week: week,
				dateTime: year + '-' + month + '-' + day,
				day: day
			};
		}

		// 添加一个时间，并返回时间
		function addDate(date, n) {
			date.setDate(date.getDate() + n);
			return date;
		}

		// 设置一周的时间，并返回array
		function setDate(date, bool) {
			var weekArray = [];
			var week = date.getDay() - 1;
			date = addDate(date, week * -1);
			if (!bool) {
				currentFirstDate = new Date(date);
			}
			for (var i = 0; i < clen; i++) {
				weekArray.push(formatDate(i == 0 ? date : addDate(date, 1)));
			}
			return weekArray
		}

		// 获取时区
		function getArea() {
			var date = new Date() + '',
				dateStr = date.split('GMT')[1];
			return dateStr.split(' (')[0]
		}

		// 添加可用课时
		function addTimeCourse(dateTime, id, startDate) {
			var courseList = $scope.params.teacherDayTimeVoList;
			addSelTime(courseList, dateTime, startDate, id);
		}

		// 移除可用课时
		function removeTimeCourse(dateTime, id) {
			var courseList = $scope.params.teacherDayTimeVoList;
			if (courseList.length != 0) {
				// 遍历数组
				for (var i = 0; i < courseList.length; i++) {
					// 如果时间相同
					if (courseList[i].teacherLessonDay == dateTime) {
						// 遍历上课时间列表
						var timeVoList = courseList[i].teacherTimeVoList;
						for (var j = 0; j < timeVoList.length; j++) {
							// 如果已有课时，则删除并跳出函数
							if (timeVoList[j].idLfdTimeBase == id) {
								timeVoList.splice(j, 1);
								if (timeVoList.length == 0) {
									courseList.splice(i, 1)
								}
								return
							}
						}
					}
				}
			}
		}

		function appointment() {
			var startDay = $scope.week[0].dateTime;
			var endDay = $scope.week[$scope.week.length - 1].dateTime;
			var params = {
				"idList": [],
				"startDay": startDay,
				"endDay": endDay
			};
			$scope.params.teacherDayTimeVoList = [];
			$scope.params.weekStartDate = startDay;
			$scope.params.weekEndDate = endDay;
			// 老师课时列表
			_ajax.post('/teacherClassTime/queryTeacherAllAppointmentTimeByStudents', params, function (res) {
				var data = res.resultData;
				data.forEach(function (obj) {
					obj.isSelected = true
				});
				$scope.list = res.resultData;
				if (!$scope.editAva) {
					var timeList = $scope.params.teacherDayTimeVoList;
					data.forEach(function (obj) {
						var id = getStartTimeId(obj.classBeginTimeTeacherHM);
						addSelTime(timeList, obj.classBeginTimeTeacherYMD, obj.classBeginTimeTeacherHM, id)
					})
				}
			});
			// 已约课学生
			_ajax.get('/teacherClassTime/queryAppointmentUser/' + startDay + '/' + endDay, {}, function (res) {
				$scope.studentList = res.resultData
			})
		}

		function selectStudent(event, id) {
			var $input = $(event.target),
				checked = event.target.checked,
				userId = id;
			if (checked) {
				$input.parent().addClass('checked');
				$scope.list.forEach(function (obj) {
					if (userId == obj.idUser) {
						obj.isSelected = true
					}
				})
			} else {
				$input.parent().removeClass('checked');
				$scope.list.forEach(function (obj) {
					if (userId == obj.idUser) {
						obj.isSelected = false
					}
				})
			}
		}

		/**
		 * 获取课时时间ID
		 * @param startTime
		 * @returns {*|string}
		 */
		function getStartTimeId(startTime) {
			var timeList = $scope.timeArea;
			if (timeList.length != 0) {
				for (var i = 0; i < timeList.length; i++) {
					if (timeList[i].startDate == startTime) {
						return timeList[i].idLfdTimeBase
					}
				}
			}
		}

		/**
		 * 添加课时集合
		 * @param list    课时集合 $scope.params.teacherDayTimeVoList
		 * @param startData     课时日期
		 * @param startTime 课时时间
		 * @param id 时间基础表ID
		 */
		function addSelTime(list, startData, startTime, id) {
			var flag;
			if (list.length != 0) {
				for (var i = 0; i < list.length; i++) {
					// 判断数组中是否已有选中日期
					if (list[i].teacherLessonDay == startData) {
						// 如果已有日期，遍历课时数组
						var timeVoList = list[i].teacherTimeVoList;
						for (var j = 0; j < timeVoList.length; j++) {
							// 如果已有课时，不做处理，跳出方法
							if (timeVoList[j].idLfdTimeBase == id) {
								return;
							}
						}
						// 如果没有此条数据，则push进去
						timeVoList.push({
							startDate: startTime,	// 老师上课开始时间
							idLfdTimeBase: id		// 时间基础表Id
						});
						flag = true;
						break;
					}
				}
				// 如果整个数组都没有这天的数据，则push进去
				if (!flag) {
					list.push({
						teacherLessonDay: startData,		// 老师上课时间
						teacherTimeVoList: [
							{
								startDate: startTime,	// 老师上课开始时间
								idLfdTimeBase: id		// 时间基础表Id
							}
						]
					})
				}
			} else {
				list.push({
					teacherLessonDay: startData,		// 老师上课时间
					teacherTimeVoList: [
						{
							startDate: startTime,	// 老师上课开始时间
							idLfdTimeBase: id		// 时间基础表Id
						}
					]
				})
			}
		}

		//框选选择时间
		(function () {
			var mainContent = $('.table-div-body');
			mainContent.mousedown(function (evt) {
				if (!$scope.showEdit) return false;
				if($('#selectDiv')){
					$('#selectDiv').remove();
				}
				var selList = [], removeAry = [];
				var fileNodes = $('.table-div-body li');
				fileNodes.each(function () {
					if($scope.editType.unavailable){   //选择不能上课的
						if($(this).hasClass('selected')){
							$(this).attr('class','timeList selected');
							selList.push($(this));
						}else if($(this).children('div').hasClass('selected')){
							selList.push($(this));
						}
					}else{       //选择能上课的
						if(!$(this).hasClass('selected')){
							$(this).attr('class','timeList');
							selList.push($(this));
						}
					}
				})
				var isSelect = true;
				// var evt = window.event || arguments[0];
				var startX = evt.pageX;
				var startY = evt.pageY;
				var selDiv = "<div id='selectDiv' style='position:absolute;width:0px;height:0px;font-size:0px;margin:0px;padding:0px;border:1px dashed #0099FF;background-color:#C3D5ED;z-index:1000;filter:alpha(opacity:60);opacity:0.6;display:none;'></div>";
				$('body').append(selDiv);
				$('#selectDiv').css({'left':startX+'px','top':startY+'px'});

				var _x = null;
				var _y = null;
				clearEventBubble(evt);

				mainContent.mousemove(function (evt) {
					if (isSelect) {
						if ($('#selectDiv').css('display') == "none") {
							$('#selectDiv').css('display','block');
						}
						_x = evt.pageX;
						_y = evt.pageY;
						$('#selectDiv').css({'left':Math.min(_x, startX) + "px",'top':Math.min(_y, startY) + "px",'width':Math.abs(_x - startX) + "px",'height':Math.abs(_y - startY) + "px"});

						// ---------------- 关键算法 ---------------------
						var _l = $('#selectDiv').offset().left, _t = $('#selectDiv').offset().top;
						var _w = $('#selectDiv').width(), _h = $('#selectDiv').height();

						for (var i = 0; i < selList.length; i++) {
							var sl = selList[i].width() + selList[i].offset().left;
							var st = selList[i].height() + selList[i].offset().top;
							if (sl > _l && st > _t && selList[i].offset().left < _l + _w && selList[i].offset().top < _t + _h) {
								if ($scope.editType.unavailable) {   //反选，框选减少div
									if (selList[i].hasClass("selected")) {
										selList[i].attr('class','timeList');
										removeAry.push(selList[i])
									} else if (selList[i].children('div').hasClass('selected')) {
										selList[i].children('div').remove();
										removeAry.push(selList[i])
									}
								} else {
									if (!selList[i].hasClass("selected")) {
										selList[i].attr('class',selList[i].attr('class') + " selected");
									}
								}
							}
							else {
								if (!$scope.editType.unavailable) {   //增加时的情况
									if (selList[i].hasClass("selected")) {
										selList[i].attr('class','timeList');
									}
								}
							}
						}

					}
					clearEventBubble(evt);
				})

				document.onmouseup = function () {
					isSelect = false;
					if (selDiv) {
						$('#selectDiv').remove();
						if (!$scope.editType.unavailable) {
							showSelDiv(selList);
						}
						else {
							showSelDiv(removeAry);
						}
					}
					selList = null, _x = null, _y = null, selDiv = null, startX = null, startY = null, evt = null;
				}
			})
		})();

		function clearEventBubble(evt) {
			if (evt.stopPropagation)
				evt.stopPropagation();
			else
				evt.cancelBubble = true;
			if (evt.preventDefault)
				evt.preventDefault();
			else
				evt.returnValue = false;
		}

		function showSelDiv(arr) {
			if (!$scope.editType.unavailable) {  //框选增加
				for (var i = 0; i < arr.length; i++) {
					if (arr[i].hasClass("selected") || arr[i].children('div').hasClass('selected')) {
						addSelTime($scope.params.teacherDayTimeVoList, arr[i].parent().attr('data-date-time'), arr[i].attr('data-time-area'), arr[i].attr('data-id'));
					}
				}
			} else {   //框选减少
				for (var j = 0; j < arr.length; j++) {
					removeTimeCourse(arr[j].parent().attr('data-date-time'), arr[j].attr('data-id'));
				}
			}
		}

		/**
		 * 获取毫秒时间
		 * @param dateTime
		 * @returns {number}
		 */
		function getTime(dateTime) {
			return new Date(dateTime).getTime()
		}
	}])
});