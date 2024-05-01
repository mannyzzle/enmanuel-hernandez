#!/bin/bash

# NOTE: use brand guidelines to use correct colors

sourceWebsite="https://github.com/FortAwesome/Font-Awesome/"

git clone $sourceWebsite

mv -f ./Font-Awesome/sprites/brands.svg ./assets/img/brands.svg
mv -f ./Font-Awesome/sprites/solid.svg ./assets/img/solid.svg

rm -rf ./Font-Awesome/
