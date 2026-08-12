#!/usr/bin/env node
'use strict';

// Legacy entry point. The canonical CLI now lives in the SDK:
//   sdk/bin/cli.js
// Keep this shim so skills, docs, and older automation can keep calling:
//   node ui/lib/cli.js ...
require('../../sdk/bin/cli');
