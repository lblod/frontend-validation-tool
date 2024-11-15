import Application from 'frontend-validation-tool/app';
import config from 'frontend-validation-tool/config/environment';

import { setApplication } from '@ember/test-helpers';
import { start } from 'ember-qunit';
import { setup } from 'qunit-dom';
import * as QUnit from 'qunit';

setApplication(Application.create(config.APP));

setup(QUnit.assert);

start();
