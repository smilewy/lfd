/**
 * Created by Administrator on 2017/2/9.
 */
define(["route"], function (app) {
	app.filter("grade", function () {   // 年级
		return function (str) {
			if (str == "0") {
				return "Preschool"
			}
			return "Grade " + str
		}
	})
		.filter("sex", function () {    // 性别
			return function (val) {
				var str = "";
				switch (val) {
					case "1":
						str = "boy";
						break;
					case "2":
						str = "girl";
						break;
				}
				return str;
			}
		})
		.filter("dateToLowerCase", function () {    //将时间中的PM AM大写转小写
			return function (input) {
				var result = input;
				if (result.indexOf("AM") > 0) {
					result = result.replace(new RegExp("AM", "gm"), "am");
				}
				if (input.indexOf("PM") > 0) {
					result = result.replace(new RegExp("PM", "gm"), "pm");
				}
				return result;
			}
		})
		.filter('starFilterFill', function () {
			return function (input) {
				if (input) {
					var starNum = new Array(parseInt(input));
					return starNum;
				}
			}
		})
		.filter('starFilterNull', function () {
			return function (input) {
				if (input) {
					var starNum = new Array(5 - parseInt(input));
					return starNum;
				}
			}
		})
		.filter('encode', function () {
			return function (val) {
				return encodeURIComponent(val)
			}
		})
});