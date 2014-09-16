angular.module('ThreeSixtyOneView.config')
	.constant('SERVER', {
		//Local
		'127.0.0.1': 'http://ec2-54-205-7-240.compute-1.amazonaws.com:8080',
		//QA
		'ec2-54-91-240-179.compute-1.amazonaws.com/': 'http://ec2-54-91-240-179.compute-1.amazonaws.com:8080',
		//DEV
		'ec2-54-205-7-240.compute-1.amazonaws.com/': 'http://ec2-54-205-7-240.compute-1.amazonaws.com:8080',
		//My Dev
		'ec2-54-204-44-149.compute-1.amazonaws.com/': 'http://ec2-54-91-240-179.compute-1.amazonaws.com:8080'
});