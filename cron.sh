#!/bin/bash
export dir=$(cd -P -- "$(dirname -- "$0")" && pwd -P)
cd "$dir"
node index.js searches.json
node index.js searches-hawaii.json

