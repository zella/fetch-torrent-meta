const WebTorrent = require('webtorrent');
const Rimraf = require("rimraf");
const Os = require('os');
const Path = require('path');

const client = new WebTorrent();

const dir = process.env.WEBTOR_SPIDER_DIR || (Path.join(Os.tmpdir(), 'webtorrent_spider'));

const torrentId = process.argv[2];

client.on('error', function (err) {
    console.error(err);
    process.exit(-1)
});

client.add(torrentId, {path: dir}, function (torrent) {

    torrent.deselect(0, torrent.pieces.length - 1, false);

    const obj = {
        "infoHash": torrent.infoHash,
        "numPeers": torrent.numPeers,
        "name": torrent.name,
        "files": torrent.files.map(function (f, index) {
            return {
                "index": index,
                "length": f.length,
                "path": f.path
            };
        })
    };

    torrent.destroy();

    Rimraf.sync(Path.join(dir, torrent.infoHash));

    process.stdout.write(JSON.stringify(obj) + Os.EOL, () => process.exit());

});



