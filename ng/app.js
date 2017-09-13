/**
 * Created by zhongyuqiang on 16/11/30.
 */
angular.module('app', [
  'ui.router',
  'ui.select2',
  'ui.bootstrap',
  'mgcrea.ngStrap.datepicker',
  'mgcrea.ngStrap.dropdown',
  'ngAnimate',
  'angular-loading-bar',
  //'angular-underscore',
  'ivh.treeview',
  'ksSwiper',
  'toastr',
  'angularFileUpload',
  'ngSanitize',
  'app.router',
  'mainMdl',
  'mainApi',
  'homeMdl',
  'homeApi',
  'propertyMdl',
  'propertyApi',
  'deviceMdl',
  'deviceApi',
  'doorMdl',
  'doorApi',
  'logMdl',
  'logApi',
  'directive.pagination',
  'directive.cascade',
  'directive.filterButton',
  'directive.select'
]);

angular.module('app')
  .run(initConfig)
  .config(config)
  .animation('.fad',fad);

function initConfig(uiSelect2Config){
  uiSelect2Config.minimumResultsForSearch = -1;
  uiSelect2Config.placeholder = "Placeholder text";
}

function config(ivhTreeviewOptionsProvider, toastrConfig){
  ivhTreeviewOptionsProvider.set({
    idAttribute: 'id',
    labelAttribute: 'name',
    childrenAttribute: 'children',
    selectedAttribute: 'selected',
    useCheckboxes: true,
    expandToDepth: 0,
    indeterminateAttribute: '__ivhTreeviewIndeterminate',
    expandedAttribute: '__ivhTreeviewExpanded',
    defaultSelectedState: false,
    validate: true,
    twistieExpandedTpl: '<span class="fa fa-minus" style="margin-right: 2px;"></span>',
    twistieCollapsedTpl: '<span class="fa fa-plus" style="margin-right: 2px;"></span>',
    twistieLeafTpl: '<span class="fa fa-file" style="margin-right: 2px;"></span>'
  });

  angular.extend(toastrConfig, {
    iconClasses: {
      error: 'toast-error',
      info: 'toast-dark',
      success: 'toast-success',
      warning: 'toast-warning'
    },
    timeOut: 500
  });
}

function fad() {
  return {
    enter: function(element, done) {
      element.css({
        opacity: 0
      });
      element.animate({
        opacity: 1
      }, 0, done);
    },
    leave: function (element, done) {
      element.css({
        opacity: 1
      });
      element.animate({
        opacity: 0
      }, 1, done);
    }
  };
}