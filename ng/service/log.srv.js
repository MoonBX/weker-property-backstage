/**
 * Created by zhongyuqiang on 2017/8/13.
 */
angular.module('logApi', [])
  .factory('logSrv', logSrv);

logSrv.$inject = ['$q', '$http', 'mainSrv'];
function logSrv($q, $http, mainSrv) {
  var server = mainSrv.getHttpRoot();
  var logList = {
    getIntercom: function(pageNo, limit, obj) {
      var defer = $q.defer();
      $http({
        method: 'GET',
        url: server + '/log/intercom/' + pageNo + '/' + limit,
        params: obj,
        headers: {
          'token': localStorage.wekerToken,
          'Content-Type': 'application/json;charset=UTF-8'
        }
      })
        .success(function (data) {
          defer.resolve(data);
        })
        .error(function (error) {
          defer.reject(error);
        });
      return defer.promise;
    },
    getAlarmInfo: function(pageNo, limit, obj){
      var defer = $q.defer();
      $http({
        method: 'GET',
        url: server + '/device/alarmInfo/log/list/' + pageNo + '/' + limit,
        params: obj,
        headers: {
          'token': localStorage.wekerToken,
          'Content-Type': 'application/json;charset=UTF-8'
        }
      })
        .success(function (data) {
          defer.resolve(data);
        })
        .error(function (error) {
          defer.reject(error);
        });
      return defer.promise;
    }
  }
  return logList;
}