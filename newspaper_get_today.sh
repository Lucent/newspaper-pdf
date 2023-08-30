#!/bin/bash

cd /var/www/lucent.design/newspaper-pdf/
/home/lucent/.nvm/versions/node/v20.5.0/bin/node ./knoxnews.mjs >> fetch.log 2>&1
