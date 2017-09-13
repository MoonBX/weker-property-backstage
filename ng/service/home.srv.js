/**
 * Created by zhongyuqiang on 2017/8/11.
 */
angular.module('homeApi', [])
  .factory('homeSrv', homeSrv);

homeSrv.$inject = ['$q', '$http', 'mainSrv'];
function homeSrv($q, $http, mainSrv){
  var server = mainSrv.getHttpRoot();
  var homeList = {
    getAlarmInfo: function(){
      var defer = $q.defer();
      $http({
        method: 'GET',
        url: server + '/device/alarmInfo/list',
        headers: {
          'token': localStorage.wekerToken,
          'Content-Type': 'application/json;charset=UTF-8'
        }
      })
        .success(function(data){
          defer.resolve(data);
        })
        .error(function(error){
          defer.reject(error);
        });
      return defer.promise;
    },
    getStatistics: function(){
      var defer = $q.defer();
      $http({
        method: 'GET',
        url: server + '/community/statistics/homepage',
        headers: {
          'token': localStorage.wekerToken,
          'Content-Type': 'application/json;charset=UTF-8'
        }
      })
        .success(function(data){
          defer.resolve(data);
        })
        .error(function(error){
          defer.reject(error);
        });
      return defer.promise;
    }
  };

  return homeList;
}