/**
 * Created by zhongyuqiang on 2017/8/13.
 */
angular.module('deviceApi', [])
  .factory('deviceSrv', deviceSrv);

deviceSrv.$inject = ['$q', '$http', 'mainSrv'];
function deviceSrv($q, $http, mainSrv){
  var server = mainSrv.getHttpRoot();

  var deviceList = {
    getDevice: function(pageNo, limit, obj) {
      var defer = $q.defer();
      $http({
        method: 'GET',
        url: server + '/device/list/' + pageNo + '/' + limit,
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
    closeDoor: function(id, status) {
      var defer = $q.defer();
      $http({
        method: 'POST',
        url: server + '/device/'+id+'/'+status+'/change',
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
  }

  return deviceList;
}