#!/bin/bash

echo FILE NAME ?
read FIlE

echo COMMITMENT ?
read COMMIT

echo REMOTE ADDRESS ?
read REMOTE

echo BRANCH NAME ?
read BRANCH


git add $FILE && git commit -m /""$COMMIT"/" && git push $REMOTE $BRANCH
