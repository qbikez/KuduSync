///<reference path='FileInfoBase.ts'/>
var nodePath = require("path");

class ManifestEntry {
    constructor(public filename: string) {}
}

class Manifest {

    private _files: { [key: string] : ManifestEntry; };

    constructor () {
        this._files = {};
    }

    static load(manifestPath: string) {
        var manifest = new Manifest();

        if (manifestPath == null) {
            return Q.resolve(manifest);
        }
        
        return Q.nfcall(fs.readFile, manifestPath, 'utf8').then(
            function(content?) {
                var filePaths = content.split("\n");
                var files = {}
                filePaths.forEach(
                    function (filePath) {
                        var file = filePath.trim();
                        if (file != "") {
                            files[file] = new ManifestEntry(file);
                        }
                    }
                );
                manifest._files = files;
                return Q.resolve(manifest);
            },
            function(err?) {
                // If failed on file not found (34/-4058), return an empty manifest
                if (err.errno == 34 || err.errno == -4058) {
                    return Q.resolve(manifest);
                }
                else {
                    return Q.reject(err);
                }
            });
    }

    static save(manifest: Manifest, manifestPath: string) {
        Ensure.argNotNull(manifest, "manifest");
        Ensure.argNotNull(manifestPath, "manifestPath");

        var manifestFileContent = "";
        var filesForOutput = new string[];

        var i = 0;
        for (var key in manifest._files) {
            filesForOutput[i] = manifest._files[key].filename;
            i++
        }

        var manifestFileContent = filesForOutput.join("\n");
        return Q.nfcall(fs.writeFile, manifestPath, manifestFileContent, 'utf8');
    }

    isPathInManifest(path: string, rootPath: string, targetSubFolder: string) {
        Ensure.argNotNull(path, "path");
        Ensure.argNotNull(rootPath, "rootPath");

        var relativePath = pathUtil.relative(rootPath, path);
        relativePath = (targetSubFolder
                ? nodePath.join(targetSubFolder, relativePath)
                : relativePath);
        return this._files[relativePath] != null;
    }

    addFileToManifest(path: string, rootPath: string, targetSubFolder: string) {
        Ensure.argNotNull(path, "path");
        Ensure.argNotNull(rootPath, "rootPath");

        var relativePath: string = pathUtil.relative(rootPath, path);
        relativePath = (targetSubFolder
                ? nodePath.join(targetSubFolder, relativePath)
                : relativePath);
        this._files[relativePath] = new ManifestEntry(relativePath);
    }
}
