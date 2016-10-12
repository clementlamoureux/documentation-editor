"use strict";

var gulp = require('gulp');
var bump = require('gulp-bump');
var clean = require('gulp-clean');
var run = require('gulp-run');
var rename = require('gulp-rename');

var notifier = require('node-notifier');
var fs = require('fs');
var request = require('request');

var builder = require('electron-builder');

gulp.task('clean', () => {
    //rm -rf dist
    console.log('_______CLEAN_______');
    return gulp.src('dist', {read: false})
       .pipe(clean());
});

gulp.task('bump', ['clean'], () => {
    //increment version
    console.log('_______BUMP_______');
    return gulp.src('./app/package.json')
        .pipe(bump())
        .pipe(gulp.dest('./app/'));
});

gulp.task('notify-slack', ['bump'], () => {
    console.log('_______SLACK_______');
    var name = require('./app/package.json').name;
    var version = require('./app/package.json').version;
    var message = 'Nouvelle version ' + version + ' pour ' + name;

    var options = {
        uri: 'https://hooks.slack.com/services/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',
        method: 'POST',
        json: {
            "text": message
        }
    };

    return request(options, (error) => {
        if (error) {
            console.log(error); // Print the shortened url.
        }
    });
});

gulp.task('mkdir', ['notify-slack'], () => {
    //create dir dist and export
    console.log('_______MKDIR_______');
    run('mkdir -p dist').exec()
        .pipe(gulp.dest('./dist/output'));
});

gulp.task('build', ['mkdir'], () => {
    //compile electron in app dir windows mac and linux versions
    console.log('_______BUILD_______');
    var sh = 'NODE_ENV=\'prod\' && build -wml --x64';
    //var sh = 'echo $PATH';
    return run(sh).exec()
        .pipe(gulp.dest('./dist/output'));
});

gulp.task('export', ['build'], () => {
    console.log('_______EXPORT_______');

    var appConfig = require('./app/package.json');

    var deb = appConfig.name + '-' + appConfig.version + '.deb';
    var dmg = appConfig.productName + '-' + appConfig.version + '.dmg';
    var zip = appConfig.productName + '-' + appConfig.version + '-' + 'mac.zip';
    var exe = appConfig.productName + '\ Setup\ ' + appConfig.version + '.exe';
    var nupkg = appConfig.name + '-' + appConfig.version + '-full.nupkg';

    var dir = './dist/';
    var linux = dir;
    var mac = dir + 'mac/';
    var win = dir + 'win/';


    var exportDir = dir + 'export/' + appConfig.name + '_' + appConfig.version + '/';
    run('mkdir -p ' + exportDir).exec()
        .pipe(gulp.dest('./dist/output'));

    var path = [
        linux + deb,
        mac + dmg,
        mac + zip,
        win + exe,
        win + nupkg
    ];

    var newPath = [
        linux + deb.replace(/\s+/g, '-'),
        mac + dmg.replace(/\s+/g, '-'),
        mac + zip.replace(/\s+/g, '-'),
        win + exe.replace(/\s+/g, '-'),
        win + nupkg.replace(/\s+/g, '-')
    ];

    return path.forEach((file, key) => {
        console.log(file);
        gulp.src(file)
            .pipe(rename(newPath[key]))
            .pipe(gulp.dest(exportDir));
    });
});

gulp.task('send', ['export'], () => {
    var config = require('./package.json');
    var name = require('./app/package.json').name;
    var version = require('./app/package.json').version;
    //send archive in server
    console.log('_______SSH_______');
    var sh = 'scp -rp ./dist/export/' + name + '_' + version +  ' ' + config.ssh.user + '@' + config.ssh.ip + ':' + config.ssh.target;
    return run(sh).exec()
        .pipe(gulp.dest('./dist/output'));
});

gulp.task('default', ['send'], () => {
    return notifier.notify({
        'title': 'Electron builder',
        'message': 'Compilation finish'
    });
});