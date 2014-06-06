module.exports = function(grunt) { 
   // Project configuration.
   grunt.initConfig({
     pkg: grunt.file.readJSON('package.json'),
     // Tasks
     watch: {
       js: {
         files: ['pages/resources/js/*.js'],
         tasks: ['uglify']
       }
     },
     uglify: {
       all: {
         files: {
	   'pages/resources/js/min/main.min.js': [
           'pages/resources/js/geraCubo.js',
	   'pages/resources/js/cubeGame.js'
           ]
         }
       },
     }
   });

   // Load the plugins.
   grunt.loadNpmTasks('grunt-contrib-watch');
   grunt.loadNpmTasks('grunt-contrib-uglify');
   
   // Default task(s).
   grunt.registerTask('default', ['uglify' , 'watch']);
   
};
