'use strict';
import Conf from 'conf'
import {resolve} from 'path'

const PATH = resolve('.');

const config = new Conf({
    cwd: PATH,
    configName: 'config.json',
    fileExtension: '',
});

export {config as default}