module.exports = function(grunt) {

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),

    clean: {
      fonts: ['public/build/fonts/'],
      images: ['public/build/images/'],
      css: ['public/build/stylesheets/'],
      js: ['public/build/javascripts/'],
      after: ['public/build/javascripts/all','public/build/javascripts/concat.js','public/build/stylesheets/all','public/build/stylesheets/concat.css'],
    },

    copy: {
      fonts: {
        files: [
          {expand: true, flatten: true, src: ['public/fonts/**'], dest: 'public/build/fonts/', filter: 'isFile'}
        ]
      },

      css: {
        files: [
          {expand: true, flatten: true, src: ['public/stylesheets/**'], dest: 'public/build/stylesheets/all/', filter: 'isFile'},
        ]
      }
    },

    concat: {
      vendor: {
        src: ['public/javascripts/vendor/jquery-1.11.1.min.js',
              'public/javascripts/vendor/bootstrap.min.js',
              'public/javascripts/vendor/bootstrap-filestyle.js',
              'public/javascripts/vendor/bootbox.min.js',
              'public/javascripts/vendor/jquery-scrolltofixed-min.js',
              'public/javascripts/vendor/moment.min.js',
              'public/javascripts/vendor/underscore-min.js',
              'public/javascripts/vendor/handlebars.min.js',
              'public/javascripts/vendor/backbone-min.js',
              'public/javascripts/vendor/highcharts.js',
              'public/javascripts/vendor/highcharts_exporting.js',
              'public/javascripts/vendor/jquery.nouislider.all.js',
              'public/javascripts/vendor/select2.js'],
        
        dest: 'public/build/javascripts/all/1_vendors.js'
      },

      app_utils: {
        src: ['public/javascripts/app/util/*.js'],
        dest: 'public/build/javascripts/all/2_utils.js'
      },

      app_models: {
        src: ['public/javascripts/app/model/*.js'],
        dest: 'public/build/javascripts/all/3_models.js'
      },

      app_collections: {
        src: ['public/javascripts/app/collection/*.js'],
        dest: 'public/build/javascripts/all/4_collections.js'
      },

      app_views: {
        src: ['public/javascripts/app/view/*.js'],
        dest: 'public/build/javascripts/all/5_views.js'
      },

      app_router: {
        src: ['public/javascripts/app/router/*.js'],
        dest: 'public/build/javascripts/all/6_router.js'
      },

      app_main: {
        src: ['public/javascripts/app/app.js'],
        dest: 'public/build/javascripts/all/7_main.js'
      },

      all: {
        src: ['public/build/javascripts/all/*.js'],
        dest: 'public/build/javascripts/concat.js'
      },

      css: {
        src: 'public/build/stylesheets/all/*.css',
        dest: 'public/build/stylesheets/concat.css'
      }
    },

    uglify: {
      my_target: {
        files: {
          'public/build/javascripts/main.min.js': ['public/build/javascripts/concat.js']
        }
      }
    },

    cssmin: {
      minify: {
        files: {
          'public/build/stylesheets/main.min.css': ['public/build/stylesheets/concat.css']
        }
      }
    },

    imagemin: {
      dynamic: { 
        options: {                      
          optimizationLevel: 3,
        },
        files: [{
          expand: true,                  
          cwd: 'public/images/',         
          src: ['**/*.{png,jpg,gif}'],   
          dest: 'public/build/images/'   
        }]
      }
    },

    watch: {
      js: {
        files: ['assets/js/app/**/*.js','assets/js/vendor/*.js'],
        tasks: ['clean:js','copy:js','concat:vendor','concat:app_utils','concat:app_models','concat:app_collections','concat:app_views','concat:app_router','concat:all','uglify']
      },
      css: {
        files: 'assets/css/*.css',
        tasks: ['clean:css','copy:css','concat:css','cssmin']
      },
    },

  });

  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-cssmin');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-imagemin');

  grunt.registerTask('default', ['clean','copy','concat','uglify','cssmin','imagemin','clean:after']);
  grunt.registerTask('dev', ['clean','copy','concat','uglify','cssmin']);

};