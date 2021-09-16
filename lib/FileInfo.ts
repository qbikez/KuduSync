///<reference path='FileInfoBase.ts'/>

class FileInfo extends FileInfoBase {
    private _size;
    private _modifiedTime: Date;
    private _version: string;

    constructor (path: string, rootPath: string, size: any, modifiedTime: any, version?: string) {
        super(path, rootPath);
        Ensure.argNotNull(size, "size");
        Ensure.argNotNull(modifiedTime, "modifiedTime");

        this._size = size;
        this._modifiedTime = new Date(modifiedTime);
        this._version = version;
    }

    modifiedTime() {
        return this._modifiedTime;
    }

    size() {
        return this._size;
    }

    version() {
        return this._version;
    }

    equals(otherFile: FileInfo): bool {
        if (this.modifiedTime() == null || otherFile.modifiedTime() == null) {
            return false;
        }

        if (this.modifiedTime().getTime() !== otherFile.modifiedTime().getTime() || this.size() !== otherFile.size()) {
            return false;
        }

        if (!!this.version() && !!otherFile.version() && this.version() != otherFile.version()) {
            return false;
        }

        return true;
    }
}
