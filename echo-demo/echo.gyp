# Copyright (c) 2014 Intel Corporation. All rights reserved.
# Use of this source code is governed by a BSD-style license that can be
# found in the LICENSE file.

{
  'includes':[
    '../build/common.gypi',
  ],

  'targets': [
    {
      'target_name': 'echo',
      'type': 'none',
      'variables': {
        'java_in_dir': '.',
        'js_file': 'echo.js',
        'json_file': 'echo.json',
        'input_jars_paths': [
          '<!(dirname $(which make_apk.py))/libs/xwalk_app_runtime_java.jar',
          '<(android_jar)',
        ],
      },
      'includes': [ '../build/java.gypi' ],
    },
  ],
}
