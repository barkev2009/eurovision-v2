#!/bin/bash

git stash
git pull
bash start_server_prod.sh & bash start_client_prod.sh