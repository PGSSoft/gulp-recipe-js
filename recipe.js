'use strict';

/**
 * Js transforming hook provider.
 *
 * Provides hook for js processing and watcher firing only on changed files in development environment.
 * Provides source maps as data urls inside compiled files.
 * Works well with recipes like [gulp-recipe-autoprefixer](https://github.com/PGS-dev/gulp-recipe-autoprefixer).
 *
 * @config paths.tmp temp folder path
 */
module.exports = function ($, config, sources) {

    /* Tasks
     ********/

    /**
     * Runs all hooked actions on all js files and saves them to configured temp directory.
     *
     * @task js
     * @config tasks.js js task name
     */
    function jsTask() {
        return sources.js
            .pipe($.sourcemaps.init)
            .pipe(devProcessJsHook())
            .pipe($.sourcemaps.write)
            .pipe($.gulp.dest, config.paths.tmp)();
    }

    /**
     * Starts Watching all js files and runs hooked actions only on changed files.
     *
     * @task watch:js
     * @config tasks.watchJs watch:js task name
     * @deps js
     */
    function watchJsTask() {
        $.utils.watchSource(sources.js)
            .pipe($.sourcemaps.init)
            .pipe(devProcessJsHook())
            .pipe($.sourcemaps.write)
            .pipe($.gulp.dest, config.paths.tmp)();
    }

    // register tasks
    $.utils.maybeTask(config.tasks.watchJs, [config.tasks.js], watchJsTask);
    $.utils.maybeTask(config.tasks.js, jsTask);

    /* Provided hooks
     *****************/

    /**
     * Sequential tasks for js processing.
     *
     * @hook pipes.devProcessJs*
     * @hookType sequential
     */
    function devProcessJsHook() {
        return $.utils.sequentialLazypipe($.utils.getPipes('devProcessJs'));
    }

    /* Used hooks
     *************/
    return {
        /**
         * Exports watch:js task to watch combiner.
         *
         * @hooks watch
         */
        watch: config.tasks.watchJs
    }
};