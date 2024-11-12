#!/bin/bash

# Start a new tmux session
tmux new-session -d -s my_session




# Start Redis server in the first window
tmux rename-window -t my_session:0 'redis-server'
tmux send-keys -t my_session:0 'killall redis-server; sleep 1' C-m
tmux send-keys -t my_session:0 'redis-server' C-m

# Create a new window for MailHog
tmux new-window -t my_session -n 'MailHog'
tmux send-keys -t my_session:1 '~/go/bin/MailHog' C-m

# Create a new window for the first Celery worker
tmux new-window -t my_session -n 'Celery Worker'
tmux send-keys -t my_session:2 'source ./venv/bin/activate; celery -A app:celery_app worker -l INFO' C-m

# Create a new window for the  Celery beat
tmux new-window -t my_session -n 'Celery Beat'
tmux send-keys -t my_session:3 'source ./venv/bin/activate; celery -A app:celery_app beat -l INFO' C-m

# Create a new window for the Flask app
tmux new-window -t my_session -n 'Flask App'
tmux send-keys -t my_session:4 'source ./venv/bin/activate; flask run' C-m

#kill tmux
tmux new-window -t my_session -n 'End TMUX'
tmux send-keys -t my_session:5 'killall redis-server; sleep 1;tmux kill-server'

# Attach to the tmux session
tmux attach-session -t my_session


