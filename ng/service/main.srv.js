/**
 * Created by zhongyuqiang on 16/11/30.
 */
angular.module('mainApi', [])
  .factory('mainSrv', mainSrv)
  .service('fileUpload', fileUpload);

mainSrv.$inject = ['$q', '$http'];
function mainSrv($q, $http){
  var server = "http://192.168.23.241:8082";
  //var server = "http://114.55.143.170:8082";
   //var server = "http://116.62.39.38:8081";

  var mainList = {
    getHttpRoot: function(){
      return server;
    },
    login: function(obj){
      var defer = $q.defer();
      $http({
        method: 'POST',
        url: server + '/account/login',
        data: obj
      })
        .success(function(data){
          defer.resolve(data);
        })
        .error(function(error){
          defer.reject(error);
        });
      return defer.promise;
    },

    logout: function(){
      var defer = $q.defer();
      $http({
        method: 'GET',
        url: server + '/account/logout',
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

    logup: function(obj){
      var defer = $q.defer();
      console.log(obj);
      $http({
        method: 'POST',
        url: server + '/account/password/edit',
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

    getAddress: function (){
      var defer = $q.defer();
      $http.get("../../data/data.json")
        .success(function (data) {
          defer.resolve(data);
        })
        .error(function(data){
          defer.reject();
          console.log(data);
        });
      return defer.promise;
    },

    getPartitions: function(){
      var defer = $q.defer();
      $http({
        method: 'GET',
        url: server + '/community/partitions',
        headers: {
          'token': localStorage.wekerToken,
          'Content-Type': 'application/json;charset=UTF-8'
        }
      })
        .success(function (data) {
          defer.resolve(data);
        })
        .error(function(data){
          defer.reject();
          console.log(data);
        });
      return defer.promise;
    },

    getBlocks: function(partitionId){
      var defer = $q.defer();
      $http({
        method: 'GET',
        url: server + '/community/'+partitionId+'/blocks',
        headers: {
          'token': localStorage.wekerToken,
          'Content-Type': 'application/json;charset=UTF-8'
        }
      })
        .success(function (data) {
          defer.resolve(data);
        })
        .error(function(data){
          defer.reject();
          console.log(data);
        });
      return defer.promise;
    },

    getUnits: function(blockId){
      var defer = $q.defer();
      $http({
        method: 'GET',
        url: server + '/community/' + blockId + '/units',
        headers: {
          'token': localStorage.wekerToken,
          'Content-Type': 'application/json;charset=UTF-8'
        }
      })
        .success(function (data) {
          defer.resolve(data);
        })
        .error(function(data){
          defer.reject();
          console.log(data);
        });
      return defer.promise;
    },

    getRooms: function(unitId){
      var defer = $q.defer();
      $http({
        method: 'GET',
        url: server + '/community/' + unitId + '/rooms',
        headers: {
          'token': localStorage.wekerToken,
          'Content-Type': 'application/json;charset=UTF-8'
        }
      })
        .success(function (data) {
          defer.resolve(data);
        })
        .error(function(data){
          defer.reject();
          console.log(data);
        });
      return defer.promise;
    },

    // pagesNum , pagesSplit , pages, pageNo
    pagination: function(pagesNum, pagesSplit, pages, pageNo){

      if(pagesNum<=7){
        for(var i=0;i<pagesNum;i++){
          pages[i] = {text: i+1, active: false};
        }
        if(pages.length){
          pages[pageNo-1].active = true;
        }
      }else{
        //页码小于5的情况
        if(pageNo<5){
          for(var i=0;i<pagesSplit;i++){
            pages[i] = {text: i+1, active: false};
          }
          pages[pageNo-1].active = true;
        }
        //页码大于5 小于(全部页码-3)的情况
        else if(pageNo>=5&&pageNo<pagesNum-3){
          for(var i=pageNo-4, j=0;i<pageNo+3, j<7;i++, j++){
            pages[j] = {text: i+1, active: false};
          }
          pages[3].active = true; // 当大于5条信息时, 它的位置总是第4个
        }
        //最后三个页码
        else if(pageNo>=pagesNum-3){
          for(var i=pagesNum-7, j=0;i<pagesNum, j<7;i++, j++){
            pages[j] = {text: i+1, active: false};
          }
          pages[6-(pagesNum-pageNo)].active = true; // 最后3条信息的位置是: 7-(总共页码-当前页码)-1
        }
      }
    },

    getSearch: function(newobj, cb){
      var obj = newobj;
      for(var a in obj){
        if(obj[a]==0&&typeof obj[a] == "number"){
          continue;
        }
        if(obj[a]==""||obj[a]=='undefined'){
          delete obj[a]
        }
      }
      var str = JSON.stringify(newobj);
      sessionStorage.filterList = str;
      console.log(obj);
      cb(1, obj);
    }
  };

  return mainList;
}

fileUpload.$inject = ['$http', '$q'];
function fileUpload($http, $q){
  this.uploadFileToUrl = function(file, uploadUrl){
    var defer = $q.defer();
    var fd = new FormData();
    console.log(file, 'ff');
    fd.append('picture', file);
    console.log(fd);
    $http.post(uploadUrl, fd, {
      transformRequest: angular.identity,
      headers: {
        'Content-Type': 'multipart/form-data;boundary='+ Math.random()
      }
    }).success(function(data, status){
      console.log('success', data);
      defer.resolve({'code': 0, 'status': status, 'data': data});
    }).error(function(error, status){
      console.log('error');
      defer.reject({'code': -200, 'status': status, 'data': error});
    });
    return defer.promise;
  }
}