#!/bin/bash
 wrk -t1 -c1 -d10s http://127.0.0.1:3000&