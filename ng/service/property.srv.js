/**
 * Created by zhongyuqiang on 2017/8/11.
 */
angular.module('propertyApi', [])
  .factory('propertySrv', propertySrv);

propertySrv.$inject = ['$q', '$http', 'mainSrv'];
function propertySrv($q, $http, mainSrv){
  var server = mainSrv.getHttpRoot();
  var propertyList = {
    getAnnounce: function(pageNo, limit, obj){
      var defer = $q.defer();
      $http({
        method: 'GET',
        url: server + '/community/announcement/list/' + pageNo + '/' + limit,
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
    getDeviceDetail: function(){
      var defer = $q.defer();
      $http({
        method: 'GET',
        url: server + '/community/device/detail/',
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
    createAnnounce: function(obj){
      var defer = $q.defer();
      $http({
        method: 'POST',
        url: server + '/community/announcement/add',
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
    editAnnounce: function(id){
      var defer = $q.defer();
      $http({
        method: 'POST',
        url: server + '/community/announcement/'+id+'/edit',
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
    editAnnounceSave: function(obj){
      var defer = $q.defer();
      $http({
        method: 'POST',
        url: server + '/community/announcement/editSave',
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
    deleteAnnounce: function(id){
      var defer = $q.defer();
      $http({
        method: 'POST',
        url: server + '/community/announcement/'+id+'/delete',
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
    getAnnounceDetail: function(id){
      var defer = $q.defer();
      $http({
        method: 'POST',
        url: server + '/community/announcement/'+id+'/detail',
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
    getComplaint: function(pageNo, limit, obj){
      var defer = $q.defer();
      $http({
        method: 'GET',
        url: server + '/estate/complaint/list/'+ pageNo + '/' + limit,
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
    dealComplaint: function(id, data){
      var defer = $q.defer();
      $http({
        method: 'GET',
        url: server + '/estate/complaint/'+id+'/updateStatus/'+data,
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
    getComplaintDetail: function(id){
      var defer = $q.defer();
      $http({
        method: 'GET',
        url: server + '/estate/complaint/'+id+'/detail',
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
    getStandard: function(){
      var defer = $q.defer();
      $http({
        method: 'GET',
        url: server + '/charge/standard/list',
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
    createStandard: function(obj){
      var defer = $q.defer();
      console.log(obj);
      $http({
        method: 'POST',
        url: server + '/charge/standard/save',
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
    deleteStandard: function(id){
      var defer = $q.defer();
      $http({
        method: 'GET',
        url: server + '/charge/standard/'+id+'/delete',
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
  return propertyList;
}