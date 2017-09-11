(function() {

  var prompt = angular.module('ngPrompt', ['ngDialog', 'ngSanitize', 'ui.tinymce']);


  prompt.filter('html', ['$sce', function($sce) {
    return function(text) {
      return $sce.trustAsHtml(text);
    };
  }]);
  
  prompt.component('progressSlider', {
    bindings: {
      ngModel: '=',
      edit: '<',    // boolean
      step: '<'     // integer
    },
    template: [
      '<div class="progress-slider" ng-class="{\'sliding\': editMode}">',
        '<div class="progress">',
          '<div class="progress-bar" style="width: {{progressValue}}%">',
            '<span ng-bind="progressValue + \'%\'"></span>',
          '</div>',
          '<div class="progress-slider-handle" title="Click and drag to change value" ng-show="editMode" ng-mousedown="click($event)" style="left: calc({{progressValue}}% - 5px)"></div>',
        '</div>',
      '</div>'
    ].join(' '),
    controller: ['$scope', '$element', function($scope, $element) {
    
    // NYI
    
    }]
  });

  prompt.run(['$templateCache', function($templateCache) {
    $templateCache.put('promptWindow.html', [
    ].join(' '));
  }]);

  prompt.service('$prompt', [
    'ngDialog', '$q',
    function(ngDialog, $q) {

      this.prompt = function(fields, okButton, cancelButton) {
        if(typeof fields === 'string') {
          fields = [{type: 'text', title: fields}];
        } else if(typeof fields === 'object' && fields.constructor === Object) {
          fields = [fields];
        }
        
        return doPrompt(fields, okButton, cancelButton);
      };
      
      this.alert = function() {};
      
      var doPrompt = function(submittedFields, okButton, cancelButton) {
      
      };
      
    }
  ]);

}).call(this);
