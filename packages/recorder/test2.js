const ffprobe = require('ffprobe');
const ffprobeStatic = require('ffprobe-static');

ffprobe('./output.mp4', { path: ffprobeStatic.path }).then(info => {
    console.log(info);
});
