
angular.module('documentation', ['ui.router'])
.config(['$stateProvider', function($stateProvider){
  $stateProvider.state('root', {
    url: '/',
    templateUrl: 'src/views/root.html'
  });
}])
.run(function($rootScope, $window){
  $rootScope.window = $window;
  $rootScope.data = {};
  $rootScope.data.editing = '';
  $rootScope.message = function(sender, message){
    switch(message.type){
      case 'list-files':
        $rootScope.mdFiles = message.data;
        $rootScope.askOpenFile('README.md');
        $rootScope.$apply();
        break;
      case 'read-file':
        $rootScope.currentFile = message.metadata.name;
        $rootScope.currentPath = message.metadata.name.split('/');
        $rootScope.data.editing = message.data;
        $rootScope.data.editMode = false;
        $rootScope.$apply();
        break;
    }
  };
  $rootScope.askOpenFile = function(fileName){
    window.send('read-file', fileName);
  };
  $rootScope.askListFiles = function(){
    window.send('list-files');
  };
  $rootScope.askListFiles();
})
.directive('markdownSimplemde', function($interval, $rootScope){
  return {
    link : function(scope, element){
      console.log(scope, element);
      var mde = new SimpleMDE({ element: element[0] });
      $rootScope.$watch(function(){
        return $rootScope.data.editing;
      }, function(a){
        mde.value(a);
      });
      var interval = $interval(function(){
        $rootScope.data.editing = mde.value();
      }, 1000);
      scope.$on('$destroy', function(){
        console.log('destroy');
        $interval.cancel(interval);
      });
    }
  }
})
.directive('markdownViewer', function($interval, $rootScope){
  return {
    link : function(scope, element){
      $rootScope.$watch(function(){
        return $rootScope.data.editing;
      }, function(a){
        element[0].innerHTML = markdown.toHTML(a);
        angular.element(element).find('a').on('click', function(e){
          var urlMd = angular.element(e.target).attr('href');
          $rootScope.askOpenFile(urlMd);
          e.preventDefault();
        });
      });
    }
  }
});


angular.element(document).ready(function() {
  angular.bootstrap(document, ['documentation']);
});