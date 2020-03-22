'use strict';

exports.error = function(res, reason, message, code) {
  console.log("ERROR: " + reason);
  res.status(code || 500).json(
    {
      "code": code,
      "error": message
    });
} 