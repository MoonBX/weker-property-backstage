/**
 * Created by zhongyuqiang on 2017/7/21.
 */
angular.module('directive.filterButton', [])
  .directive('myFilterButton', myFilterButton);

function myFilterButton(){
  return {
    restrict: 'E',
    scope: {
      getSearch: '&',
      clearSession: '&',
      selectList: '=',
      getList: '='
    },
    template: '<button class="btn btn-sm btn-primary p-h-lg" ng-click="getSearch({selectList: selectList, getList: getList})"> 搜索 </button> <button class="btn btn-sm btn-primary btn-stroke p-h-lg m-l-md" ng-click="clearSession()"> 清空 </button>'
  }
}