const { spawnSync } = require('child_process');
const path = require('path');

const pandaTools = 'C:\\Users\\win10\\AppData\\Local\\Packages\\PythonSoftwareFoundation.Python.3.13_qbz5n2kfra8p0\\LocalCache\\local-packages\\Python313\\site-packages\\panda3d_tools';
const pandaLib = 'C:\\Users\\win10\\AppData\\Local\\Packages\\PythonSoftwareFoundation.Python.3.13_qbz5n2kfra8p0\\LocalCache\\local-packages\\Python313\\site-packages\\panda3d';

process.env.PATH = `${pandaTools};${pandaLib};${process.env.PATH}`;

const res = spawnSync('ffmpeg', ['-version'], { stdio: 'inherit', shell: true });
console.log('FFmpeg exit code:', res.status);
