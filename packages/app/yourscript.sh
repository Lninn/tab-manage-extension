#!/bin/bash

# 输入你的密码
myPassword="$MY_PASSWORD"

# 检查是否需要输入密码
requirePassword=$(/usr/bin/pmset -g | /usr/bin/grep hibernatemode | /usr/bin/awk '{print $2}' | tr -d '\n')

if [ "$requirePassword" == "25" ]; then
    # 如果需要密码，使用密码来进入睡眠模式
    echo "$myPassword" | sudo -S pmset hibernatemode 0
    sudo pmset sleepnow
else
    # 如果不需要密码，直接进入睡眠模式
    pmset sleepnow
fi
