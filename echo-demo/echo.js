// Copyright (c) 2014 Intel Corporation. All rights reserved.
// Copyright 2014 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.

// This file has been auto-generated by code_generator_extension.py. DO NOT MODIFY!

///////////////////////////////////////////////////////////////////////////////
// Utilities
///////////////////////////////////////////////////////////////////////////////

var g_next_async_call_id = 0;
var g_async_calls = {};

function AsyncCall(resolve, reject) {
  this.resolve = resolve;
  this.reject = reject;
}

function createPromise(msg) {
  var promise = new Promise(function(resolve, reject) {
    g_async_calls[g_next_async_call_id] = new AsyncCall(resolve, reject);
  });
  msg.asyncCallId = g_next_async_call_id;
  extension.postMessage(JSON.stringify(msg));
  ++g_next_async_call_id;
  return promise;
}

function _addConstProperty(obj, propertyKey, propertyValue) {
  Object.defineProperty(obj, propertyKey, {
    configurable: true,
    writable: false,
    value: propertyValue
  });
}

function _addConstructorProperty(obj, constructor) {
  Object.defineProperty(obj, 'constructor', {
    enumerable: false,
    value: constructor
  });
}

function _addConstPropertyFromObject(obj, propertyKey, propObject) {
  if (propObject.hasOwnProperty(propertyKey)) {
    Object.defineProperty(obj, propertyKey, {
      configurable: true,
      writable: false,
      value: propObject[propertyKey]
    });
  }
}

function derive(child, parent) {
  child.prototype = Object.create(parent.prototype);
  child.prototype.constructor = child;
  _addConstructorProperty(child.prototype, child);
}

///////////////////////////////////////////////////////////////////////////////
// Exports and main entry point for the echo API
///////////////////////////////////////////////////////////////////////////////

//TODO(hdq) var g_echo_listeners = {};

extension.setMessageListener(function(json) {
  var msg = JSON.parse(json);
  switch (msg.cmd) {
    case 'dummy':
        g_async_calls[msg.asyncCallId].resolve(msg.data);
        delete _promises[msg.asyncCallId];
      break;
    case 'hi':
        g_async_calls[msg.asyncCallId].resolve(msg.data);
        delete _promises[msg.asyncCallId];
      break;
    case 'asyncCallError':
      handleAsyncCallError(msg);
      break;
    default:
      break;
  }
});

function handleAsyncCallError(msg) {
  g_async_calls[msg.asyncCallId].reject(Error('Async operation failed'));
  delete _promises[msg.asyncCallId];
}

exports.dummy = function() {
  var msg = {
    'cmd': 'dummy',
  };
  return createPromise(msg);
};

exports.hi = function(words) {
  var msg = {
    'cmd': 'hi',
    'words': words,
  };
  return createPromise(msg);
};

