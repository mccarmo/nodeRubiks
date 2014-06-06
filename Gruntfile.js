module.exports = function(grunt) { 
   // Project configuration.
   grunt.initConfig({
     pkg: grunt.file.readJSON('package.json'),
     // Tasks
     watch: {
       js: {
         files: ['pages/resources/js/*.js'],
         tasks: ['uglify']
       },
       css: {
	 files: ['pages/resources/css/*.css'],
         tasks: ['cssmin']
       }	
     },
     uglify: {
       all: {
         files: {
	   'pages/resources/js/min/main.min.js': [
	   'pages/resources/js/glMatrix-0.9.5.min.js',
	   'pages/resources/js/webgl-utils.js',
           'pages/resources/js/geraCubo.js',
	   'pages/resources/js/cubeGame.js'
           ]
         }
       },
     },
     cssmin: {
       minify: {
	 expand: true,
	 cwd: 'pages/resources/css/',
	 src: ['*.css'],
	 dest: 'pages/resources/css/min/',
	 ext: '.min.css'
       }
     }
   });

   // Load the plugins.
   grunt.loadNpmTasks('grunt-contrib-watch');
   grunt.loadNpmTasks('grunt-contrib-uglify');
   grunt.loadNpmTasks('grunt-contrib-cssmin');
   
   // Default task(s).
   grunt.registerTask('default', ['uglify' , 'cssmin' , 'watch']);
   
};
