  /**
 * Created by zhongyuqiang on 2017/7/21.
 */
angular.module('directive.select', [])
  .directive('mySelect', mySelect);

function mySelect(){
  return {
    restrict: 'E',
    scope: {
      optList: '=',
      model: '=',
      name: '@',
      placeholder: '@'
    },
    template: '<select ui-select2 ng-model="model" data-placeholder="{{placeholder}}"> <option value=""></option> <option ng-repeat="item in optList" ng-value="$index">{{item}}</option></select>'
  }
}