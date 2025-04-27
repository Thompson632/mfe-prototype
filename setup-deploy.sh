#!/bin/bash

# Remove existing staging area
rm -rf dist/deploy;

# Create staging area
mkdir -p dist/deploy/dashboard dist/deploy/cart dist/deploy/shop dist/deploy/about;

# Copy host build to staging area
cp -r dist/apps/host/* dist/deploy/;

# Copy dashboard build to staging area
cp -r dist/apps/dashboard/* dist/deploy/dashboard/;

# Copy cart build to staging area
cp -r dist/apps/cart/* dist/deploy/cart/;

# Copy shop build to staging area
cp -r dist/apps/shop/* dist/deploy/shop/;

# Copy about build to staging area
cp -r dist/apps/about/* dist/deploy/about/