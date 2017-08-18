'use strict';
var config = require('./config.js');
const angular = require('angular');

var myApp = angular
.module("myApp", [])

.controller("womenController", ["$scope",'$filter',"$http", function($scope,$filter,$http,){
    //window.alert('Internet Explorer is not good for this page, please use another browser.');
    $scope.datas = [];
    $scope.flag = false; 

    var urlGet = "http://localhost:8080/women";
    
    
    $http.get(urlGet, { username: masterTest1, password: 111111 })
    .then(function(res){
      $scope.datas = res.data;   

      console.log(res.data);
    }, function(res){
      $scope.datas = [{name: "Error!! " + res.status}];
    });



}]);


