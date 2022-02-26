#!/bin/bash

cd /app/code

NODE_ENPOINT_SCRIPT="./index.js"  # your node enterpont script

tpid=`ps -ef|grep $NODE_ENPOINT_SCRIPT|grep -v grep|grep -v kill|awk '{print $2}'`
if [ ${tpid} ]; then
    echo 'Stop App Process...'
    kill -15 $tpid
fi

sleep 5

echo "kill app thread."
ps ax |grep $NODE_ENPOINT_SCRIPT | awk '{print $1}' |xargs kill -9 ;

echo "clear nohup log."
cat /dev/null > nohup.out

sleep 2

export PORT=$Port
export NODE_ENV=$NODE_ENV

# start app
echo 'start server..'
nohup node $NODE_ENPOINT_SCRIPT &