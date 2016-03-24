'use strict';

app.config(function($stateProvider) {
	$stateProvider.state('dashboard', {
		url: '/dashboard',
		templateUrl: '/js/dashboard/dashboard.html',
		controller: 'DashboardCtrl'
	})
});

app.controller('DashboardCtrl', function($scope, $state) {

	$state.go('dashboard.allProjects');

	$(document).ready(function() {

		$('.sidebar li').click(function() {
			if($(this).find('a').hasClass('add')) return;
			$('.sidebar li').removeClass('active');
			$(this).addClass('active');
		});

	});
});