#!/bin/bash

# Copy the dashboard routes
cp apps/dashboard/public/remotes.prod.json dist/apps/dashboard/remotes.json;

# Copy the host remotes
cp apps/host/public/remotes.prod.json dist/apps/host/remotes.json;