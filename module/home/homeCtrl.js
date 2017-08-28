/**
 * Created by Administrator on 2017/2/9.
 */
define(["jquery", "route", "highcharts"], function ($, app, Highcharts) {
	app.register.controller("homeCtrl", ["$rootScope", "$scope", "$filter", "_ajax", function ($rootScope, $scope, $filter, _ajax) {
		$scope.startDate = "";
		$scope.endDate = "";

		var chart = Highcharts.chart('lineChart', {
			title: {
				style: {display: 'none'}
			},
			credits: {
				enabled: false // 禁用版权信息
			},
			subtitle: {
				style: {display: 'none'}
			},
			exporting: {
				enabled: false
			},
			xAxis: {
				categories: ["SUNDAY", "MONDAY", "TUESDAY", "WEDNESDAY", "THURSDAY", "FRIDAY", "SATURDAY"]
			},
			yAxis: {
				title: {
					style: {display: 'none'}
				},
				allowDecimals: false
			},
			legend: {
				enabled: false
			},
			series: [{
				name: 'sessions',
				data: [1, 2, 3, 4, 5, 6, 7]
			}]
		});

		var idTeacher = sessionStorage.getItem("idTeacher");
		var currentDate = getCurrentMonthFirst();
		var currentFirstDate;   // 当前周的第一天
		var thisWeek = setDate(new Date()),
			thisWeekLastDay = getTime(thisWeek[thisWeek.length - 1].dateTime);
		$scope.monthYear = $filter("date")(currentDate, "MMM") + '.' + currentDate.getFullYear();

		_ajax.get("/teacher/teacher/getTeacherInfoById", {idTeacher: idTeacher}, function (res) {
			$scope.teacherInfo = res.resultData;
			$scope.starnum = res.resultData.starLevel || 0;
		});

		workingSessions();

		// 上一周
		$scope.prevWeek = function () {
			if (currentFirstDate.getTime() <= currentDate.getTime()) {
				$scope.isPreDis = true;
				return
			}
			var preWeek = setDate(addDate(currentFirstDate, -7)),
				firstDay = preWeek[0].dateTime,
				lastDay = preWeek[preWeek.length - 1].dateTime;
			if (getTime($scope.endDate) < thisWeekLastDay) {
				$scope.isDisabled = false;
			}
			$scope.startDate = firstDay;
			$scope.endDate = lastDay;
			workingSessions();
		};

		// 下一周
		$scope.nextWeek = function () {
			$scope.isPreDis = false;
			if (getTime($scope.endDate) >= thisWeekLastDay) {
				$scope.isDisabled = true;
				return;
			}
			var nexWeek = setDate(addDate(currentFirstDate, 7)),
				lastDay = nexWeek[nexWeek.length - 1].dateTime;
			$scope.startDate = nexWeek[0].dateTime;
			$scope.endDate = lastDay;
			workingSessions();
		};

		// 外教评分
		_ajax.get("/teacher/teacher/getPerformanceById", {idTeacher: idTeacher}, function (res) {
			var data = res.resultData;
			drawCircle(getParObj("atte", "#35baf6", data.onTime));
			drawCircle(getParObj("inst", "#63d6bc", data.patience));
			drawCircle(getParObj("pati", "#fe9d92", data.guidance));
			drawCircle(getParObj("coop", "#cdc3f6", data.cooperation));
			$scope.perf = data;
		});

		/**
		 * 获取 Performance 数据
		 * @param id    节点ID
		 * @param color 颜色值
		 * @param val   值
		 * @returns {{id: *, color: string, lineWidth: string, angle: number}}
		 */
		function getParObj(id, color, val) {
			return {
				id: id,
				color: color,
				lineWidth: '7',
				angle: val / 5
			}
		}

		/**
		 * 老师一周的课时数
		 * 折线图
		 */
		function workingSessions() {
			var params = {
				idTeacher: idTeacher,   // 老师ID
				startDate: $scope.startDate,  // 开始时间
				endDate: $scope.endDate     // 结束时间
			};
			_ajax.get("/teacher/teacher/getLessonNum", params, function (res) {
				var data = res.resultData;
				var dataTemp = [0, 0, 0, 0, 0, 0, 0];
				data.forEach(function (o) {
					dataTemp[o.week - 1] = o.lessonNum
				});
				chart.series[0].update({
					data: dataTemp
				})
			})
		}

		/**
		 * 获取当前周
		 * @param date
		 * @param bool
		 * @returns {Array}
		 */
		function setDate(date, bool) {
			var weekArray = [];
			var week = date.getDay() - 1;
			date = addDate(date, week * -1);
			if (!bool) {
				currentFirstDate = new Date(date);
			}
			for (var i = 0; i < 7; i++) {
				weekArray.push(formatDate(i == 0 ? date : addDate(date, 1)));
			}
			$scope.startDate = weekArray[0].dateTime;
			$scope.endDate = weekArray[weekArray.length - 1].dateTime;
			var xAxisTemp = [];
			weekArray.forEach(function (o) {
				xAxisTemp.push(o.week)
			});
			chart.xAxis[0].update({
				categories: xAxisTemp
			});
			return weekArray
		}

		/**
		 * 添加一个日期
		 * @param date  要添加的日期
		 * @param n 添加的天数
		 * @returns {*}
		 */
		function addDate(date, n) {
			date.setDate(date.getDate() + n);
			return date;
		}

		/**
		 * 当前月及第一天
		 * @returns {Date}
		 */
		function getCurrentMonthFirst() {
			var date = new Date();
			date.setDate(1);
			return date;
		}

		/**
		 * 格式化时间
		 * @param date  日期
		 * @returns {{week: string, dateTime: string, day: (number|*)}}
		 */
		function formatDate(date) {
			var day = date.getDate();
			var month = date.getMonth() + 1;
			var year = date.getFullYear();
			var week = ["SUNDAY", "MONDAY", "TUESDAY", "WEDNESDAY", "THURSDAY", "FRIDAY", "SATURDAY"][date.getDay()];
			month = month < 10 ? '0' + month : month;
			day = parseInt(day) < 10 ? "0" + day : day;
			return {
				week: week + " (" + month + "." + day + ")",
				dateTime: year + "-" + month + "-" + day,
				day: day
			};
		}

		/**
		 * 获取毫秒时间
		 * @param dateTime
		 * @returns {number}
		 */
		function getTime(dateTime) {
			return new Date(dateTime).getTime()
		}

		/**
		 * 圆环百分比统计
		 * @param _options
		 */
		function drawCircle(_options) {
			var options = _options || {};    //获取或定义options对象;
			options.angle = options.angle || 0;    //定义默认角度1为360度(角度范围 0-1);
			options.color = options.color || '#fff';    //定义默认颜色（包括字体和边框颜色）;
			options.lineWidth = options.lineWidth || 10;    //定义默认圆描边的宽度;
			options.lineCap = options.lineCap || 'square';    //定义描边的样式，默认为直角边，round 为圆角

			var oBoxOne = document.getElementById(options.id);
			var sCenter = oBoxOne.width / 2;    //获取canvas元素的中心点;
			var ctx = oBoxOne.getContext('2d');
			var nBegin = Math.PI / 2;    //定义起始角度;
			var nEnd = Math.PI * 2;    //定义结束角度;
			var grd = ctx.createLinearGradient(0, 0, oBoxOne.width, 0);    //grd定义为描边渐变样式;
			grd.addColorStop(0, 'red');
			grd.addColorStop(0.5, 'yellow');
			grd.addColorStop(1, 'green');

			ctx.textAlign = 'center';    //定义字体居中;
			ctx.font = 'normal normal bold 46px ' + (options.fontFamily || 'Arial');    //定义字体加粗大小字体样式;
			// ctx.fillStyle = options.color == 'grd' ? grd : options.color;    //判断文字填充样式为颜色，还是渐变色;
			ctx.fillStyle = "#15a1ea";
			ctx.fillText((options.angle * 5).toFixed(1), sCenter, sCenter + 20);    //设置填充文字;
			/*ctx.strokeStyle = grd;    //设置描边样式为渐变色;
			 ctx.strokeText((options.angle * 100) + '%', sCenter, sCenter);    //设置描边文字(即镂空文字);*/
			ctx.lineCap = options.lineCap;
			ctx.strokeStyle = options.color == 'grd' ? grd : options.color;
			ctx.lineWidth = options.lineWidth;

			ctx.beginPath();    //设置起始路径，这段绘制360度背景;
			ctx.strokeStyle = '#d1f3ef';
			ctx.arc(sCenter, sCenter, (sCenter - options.lineWidth), -nBegin, nEnd, false);
			ctx.stroke();

			var imd = ctx.getImageData(0, 0, 240, 240);

			function draw(current) {    //该函数实现角度绘制;
				ctx.putImageData(imd, 0, 0);
				ctx.beginPath();
				ctx.strokeStyle = options.color == 'grd' ? grd : options.color;
				ctx.arc(sCenter, sCenter, (sCenter - options.lineWidth), -nBegin, (nEnd * current) - nBegin, false);
				ctx.stroke();
			}

			var t = 0;
			var timer = null;

			function loadCanvas(angle) {    //该函数循环绘制指定角度，实现加载动画;
				timer = setInterval(function () {
					if (t > angle) {
						draw(options.angle);
						clearInterval(timer);
					} else {
						draw(t);
						t += 0.02;
					}
				}, 20);
			}

			loadCanvas(options.angle);    //载入百度比角度  0-1 范围;
			timer = null;
		}
	}])
});