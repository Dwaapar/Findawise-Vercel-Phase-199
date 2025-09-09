#!/bin/bash
export NODE_ENV=development
export PORT=5000
tsx --env-file=.env server/index.ts