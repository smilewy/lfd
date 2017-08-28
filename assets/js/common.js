/**
 * Created by Administrator on 2017/2/6.
 */
define(function () {
	var comm = {
		/**
		 * 验证数据是否为空
		 * @param obj
		 * @returns {boolean}
		 */
		validNull: function (obj) {
			for (var o in obj) {
				if (typeof obj[o] === 'object') {
					for (var b in obj[o]) {
						if (obj[o][b] == '' || obj[o][b] == undefined || obj[o][b] == null) {
							alert('Please complete the information!');
							return false
						}
					}
				} else {
					if (obj[o] == '' || obj[o] == undefined || obj[o] == null) {
						alert('Please complete the information!');
						return false
					}
				}
			}
			return true
		}
	};
	return comm
});