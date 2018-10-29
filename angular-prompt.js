
// Requires: ngDialog, uiTinymce, bootstrap (uses glyphicons instead of relying on FontAwesome)

(function() {
  'use strict';
  
  var angularPrompt = angular.module('ngPrompt', ['ngDialog', 'ui.tinymce', 'ui.bootstrap.datetimepicker', 'ngTagsInput']);
  
  angularPrompt.filter('orderObjectBy', function() {
    return function(items, field, reverse) {
      var filtered = [];
      angular.forEach(items, function(item) {
        filtered.push(item);
      });
      filtered.sort(function(a, b) {
        return (a[field] > b[field] ? 1 : -1);
      });
      if(reverse)
        filtered.reverse();
      return filtered;
    };
  });
  angularPrompt.filter('orderObject', ['$filter', function($filter) {
    return function(items, field, reverse) {
      var filtered = [];
      angular.forEach(items, function(value, key) {
        filtered.push({id: key, value: value});
      });
      filtered = $filter('orderObjectBy')(filtered, 'value', reverse);
      return filtered;
    };
  }]);
  angular.prompt('bytes', [function() {
    return function(size, format) {
      size = parseInt(size);
      if(!isNaN(size)) {
        var b = size;
        var kb = b ? 1024 ? Math.round(b / 1024) : 0;
        var mb = kb > 1024 ? Math.round(kb / 1024) : 0;
        var gb = mb > 1024 ? Math.tound(mb / 1024) : 0;
        return gb ? gb + ' gb' : mb ? mb + ' mb' : kb ? kb + ' kb' : b + ' b';
      } else {
        return size;
      }
    };
  }]);
  
  
  angularPrompt.run(['$templateCache', function($templateCache) {
    $templateCache.put('promptWindow.template.html', [
      '<div class="ng-prompt-window">',
        '<div class="row form">',
          '<div ng-show="returnOrProcess(options.title) || returnOrProcess(options.drag) || returnOrProcess(options.minimize)" class="prompt-window-title" ng-class="{\'cursor-drag\': returnOrProcess(options.drag)}">',
            '<div class="pull-right" ng-show="returnOrProcess(options.help)" ng-click="showHelp()" style="margin-left: 5px">',
              '<span class="glyphicon glyphicon-question-sign cursor-pointer" title="Click for help"></span>',
            '</div>',
            '<div class="pull-right" ng-show="returnOrProcess(options.minimize)" ng-click="toggleMinimize()" style="margin-left: 5px">',
              '<span class="glyphicon glyphicon-modal-window cursor-pointer" ng-class="{\'invert-glyphicon\': returnOrProcess(options.isMinimized)}" title="Click to toggle minimize"></span>',
            '</div>',
            '<div class="ng-prompt-title" ng-bind-html="returnOrProcess(options.title) | html"></div>',
          '</div>',
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
                  // == END ==
                '</div>',
                '<div ng-show="returnOrProcess(field.note)" class="well prompt-note">',
                  '<span ng-bind-html="returnOrProcess(field.note) | html"></span>',
                '</div>',
              '</div>',
            '</div>',
          '</div>', // End of main form area
        '</div>',
  
        // Bottom button area
        '<div ng-hide="returnOrProcess(options.isMinimized)">',
          '<div class="row" style="margin-top: 10px">',
            '<div ng-repeat="button in buttons" class="prompt-dialog-buttons" ng-class="{\'col-xs-12\': buttons.length === 1, \'col-xs-6\': buttons.length === 2, \'col-xs-4\': buttons.length === 3, \'col-xs-3\': buttons.length === 5}">',          
              '<a href class="btn btn-default" tabindex="{{(($index !== (buttons.length - 1)) && !allMandatoryFieldsFilled()) ? -1 : 1000 + $index}}" ng-click="buttonClick($index)" ng-disabled="(($index !== (buttons.length - 1)) && !allMandatoryFieldsFilled()) || disableForm">',
                '<span ng-bind-html="button | html"></span>',
              '</a>',
            '</div>',
          '</div>',
        '</div>',
        // When Minimized
        '<div ng-show="returnOrProcess(options.isMinimized)" class="minimized-display">',
          'Window is minimized...',
        '</div>',
      '</div>'
    ].join(' '));
  }]);

  // Set the size of a <select> dynamically using ng-size
  angularPrompt.directive('ngSize', function() {





  
  
  
  
  
  
  });
  
  angularPrompt.service('$prompt', [
    'ngDialog', '$q',
    function(ngDialog, $q) {
      var $this = this;
  
      this.prompt = function(fieldArray, buttonArray, optionsObject) {
        return doPrompt(fieldArray, buttonArray, optionsObject);
      };
  
      this.alert = function(message, buttonArray, optionsObject) {
        return doPrompt({type: 'text', value: message}, buttonArray, optionsObject);
      };
  
      var returnOrProcess = function(input) {
        return (input && input.constructor === Function) ? input() : input;
      };
  
      var doPrompt = function(fieldArray, buttonArray, optionsObject) {
        var promptPromise = $q.defer();
  
        // First, build up the proper array of field objects
        if(!fieldArray) {
          console.warn('prompt::error::Invalid field data submitted');
          return;
        }
        if(fieldArray.constructor !== Array) {
          fieldArray = [fieldArray];
        }
        var fieldTemplate = {id: null, type: '', placeholder: '', class: '', width: 12, filter: null, help: null, value: null, disabled: null, options: null, size: 4, mandatory: false, click: null, tokenLimit: 1, tokenSource: null, maxResults: 10, upload: null, uploadOptions: null, uploadCallback: null, fileOptions: null};
        var fieldList = [];  
        fieldArray.forEach(function(field, index) {
          var finalField = angular.merge({}, fieldTemplate, {id: index}, field);
          fieldList.push(finalField);
        });
        
        // Second, some maintenance for every field
        fieldList.forEach(function(field) {
          
          // 1. Filters 
          // The filter should be a RegExp object, but can alternatively be one of the below string options
          // as aliases for the most common filter types
          if(field.filter !== null) {
            if(field.filter.constructor !== RegExp) {
              switch(field.filter.toLowerCase()) {
                case 'number':
                case 'num':
                case 'int':
                  field.filter = /[0-9]/;
                  break;
                case 'text':
                case 'char':
                case 'alpha':
                case 'alphanum':
                case 'alphanumeric':
                case 'date':
                  field.filter = /[A-Za-z0-9\s\-]/;
                  break;
                case 'uri':
                case 'url':
                  field.filter = /[A-Za-z0-9\-]/;
                  break;
                case 'mail':
                case 'email':
                  field.filter = /[A-Za-z0-9\.\@\-\_]/;
                  break;
                case 'phone':
                case 'telephone':
                  field.filter = /[0-9\s\(\)\-]/;
                  break;
                default:
                  field.filter = null;
              }
            }
          }
  
          // 2. Size
          // Allow for shortcut widths 'l', 'm', 's' for 12, 6, and 3 respectively
          if(typeof field.width === 'string') {
            field.width = (field.width.toLowerCase() === 'l' ? 12 : field.width.toLowerCase() === 'm' ? 6 : field.width.toLowerCase() === 's' ? 3 : 12);
          } 
  
          // 3. Special exceptions to different types
          switch(returnOrProcess(field.type)) {
            case 'boolean':
              field.mandatory = false; // Otherwise, you can't have a boolean set to 'false' ever
              field.options = field.options || {0: 'False', 1: 'True'};                                               
              break;
          }
  
        });
  
        // Third, make sure there are some closing buttons
        buttonArray = buttonArray ? (buttonArray.length ? buttonArray : [buttonArray]) : ['Ok'];
  
        // Fourth, check the optionsObject
        // if this is a string, assume it's juts the window title
        var optionsTemplate = {title: '', drag: false, overlay: true, width: 450, height: null, minimize: false, isMinimized = false, filesAsGrid: true);
        if(optionsObject) {
          if(optionsObject.construcotor === String) {                                      
            optionsObject = {title: optionsObject};
          }
        } else {
          optionsObject = {};
    }
    var options = angular.extend(optionsTemplate, optionsObject);
  
    // Next, option the prompt window itself 
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  }
]);

angularPrompt.component('classificationPicker', {
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
});

}).call(this);
