module.exports = function (grunt) {
  grunt.initConfig({
    pkg: grunt.file.readJSON('./src/package.json'),
    usebanner: {
      taskName: {
        options: {
          position: 'top',
          banner: '// banner text here',
          linebreak: true,
        },
        files: {
          src: ['./src/lib/grunt-test.js']
        }
      }
    }
  });
  // Load plugin that provides the "banner" task.
  grunt.loadNpmTasks('grunt-banner');
};
