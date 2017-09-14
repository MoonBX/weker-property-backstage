/**
 * Created by zhongyuqiang on 2017/8/11.
 */
angular.module('doorApi', [])
  .factory('doorSrv', doorSrv);

doorSrv.$inject = ['$q', '$http', 'mainSrv'];
function doorSrv($q, $http, mainSrv){
  var server = mainSrv.getHttpRoot();
  var mockServer = "https://easy-mock.com/mock/59b2565be0dc663341a27fd5/weker";
  var doorList = {
    getResident: function(pageNo, limit, obj){
      var defer = $q.defer();
      $http({
        method: 'GET',
        url: server + '/community/resident/list/' + pageNo + '/' + limit,
        params: obj,
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
    createResident: function(obj){
      var defer = $q.defer();
      $http({
        method: 'POST',
        url: server + '/community/resident/add',
        data: obj,
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
    deleteResident: function(id){
      var defer = $q.defer();
      $http({
        method: 'POST',
        url: server + '/community/resident/'+id+'/delete',
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
    editResident: function(obj){
      var defer = $q.defer();
      $http({
        method: 'POST',
        url: server + '/community/resident/edit',
        data: obj,
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
    getPublicCard: function(pageNo, limit, obj){
      var defer = $q.defer();
      $http({
        method: 'GET',
        url: server + '/public/card/list/' + pageNo + '/' + limit,
        params: obj,
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
    createPublicCard: function(obj){
      var defer = $q.defer();
      $http({
        method: 'POST',
        url: server + '/public/card/add',
        data: obj,
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
    detailPublicCard: function(id){
      var defer = $q.defer();
      $http({
        method: 'POST',
        url: server + '/public/card/'+id+'/detail',
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
    deletePublicCard: function(id){
      var defer = $q.defer();
      $http({
        method: 'POST',
        url: server + '/public/card/'+id+'/delete',
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
    checkExist: function(partitionId, unitId){
      var defer = $q.defer();
      $http({
        method: 'GET',
        url: server + '/device/isExist/'+partitionId+'/'+unitId,
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
    getIdCardInfo: function(){
      var defer = $q.defer();
      $http({
        method: 'GET',
        url: mockServer + '/idCardInfo',
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
  return doorList;
}