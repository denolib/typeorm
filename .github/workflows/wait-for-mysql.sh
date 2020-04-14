#!/bin/sh

# This file is adapted from https://github.com/manyuanrong/deno_mysql/blob/master/.github/workflows/wait-for-mysql.sh
#
# MIT License
#
# Copyright (c) 2019 EnokMan
#
# Permission is hereby granted, free of charge, to any person obtaining a copy
# of this software and associated documentation files (the "Software"), to deal
# in the Software without restriction, including without limitation the rights
# to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
# copies of the Software, and to permit persons to whom the Software is
# furnished to do so, subject to the following conditions:
#
# The above copyright notice and this permission notice shall be included in all
# copies or substantial portions of the Software.
#
# THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
# IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
# FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
# AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
# LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
# OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
# SOFTWARE.

echo "Waiting for MySQL"
for i in `seq 1 10`;
do
    result="$(echo '\q' | mysql -h 127.0.0.1 -uroot -P 3306 2>&1 > /dev/null)"
    if [ "$result" = "" ]; then
        echo "Success waiting for MySQL"
        exit 0
    fi
    >&2 echo "MySQL is waking up"
    sleep 10
done

echo "Failed waiting for MySQL" && exit 1
