var glob = require('glob'),
	  bowerJson = require('bower-json'),
	  async = require('async'),
	  path = require('path');

module.exports = function find_bower(dir, ignores, cb) {
  glob(path.join(dir, '**/bower.json'), function(err, files) {
    if (err) {
      console.error('Error finding bower.json files:', err);
      process.exit(1);
    }

    // check that files are not ignored
    files = files.filter(function(file) {
      if (ignores) {
        for (var i = 0; i < ignores.length; i++) {
          if (file.indexOf(ignores[i]) == 0) return false; // skip processing file
        }
      }
      return true;
    });

    if (files.length == 0) {
      cb(null, []);
      return;
    }

    var pkgs = [];
    async.each(files, function(path, next) {
  		bowerJson.read(path, function (err, json) {
  			if(err) return next(err);
  			json.path = path;
  			pkgs.push(json);
		    return next();
			});
    }, function(err) {
    	return cb(err, pkgs);
    });


    // files.forEach(function(file) {
    //   readJson(file, function(err, data) {
    //     var pkgdir = path.dirname(file);

    //     var libFiles = glob.sync(path.join(pkgdir, 'lib/**/*.js'));
    //     if (!err) {
    //       var mainFile = findMainFile(pkgdir, data.main || 'index');
    //       if (mainFile && libFiles.indexOf(mainFile) == -1) libFiles.push(mainFile);
    //     }

    //     pkgs.push({
    //       dir: pkgdir,
    //       packageJSONFile: file,
    //       package: data,
    //       error: err || undefined,
    //       libFiles: libFiles,
    //       testFiles: glob.sync(path.join(pkgdir, 'test/**/*.js')),
    //     });
    //     if (pkgs.length == files.length) cb(null, pkgs);
    //   });
    // });
  });
}