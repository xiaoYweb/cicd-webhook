#!/bin/bash
WORK_PATH='/usr/projects/cicd-front'
cd $WORK_PATH
echo "清楚旧代码"
git reset --hard origin/master
git clean -f
echo "拉取远程代码"
git pull origin master
echo "安装依赖"
npm i
echo "开始构建"
npm run build
echo "创建docke 镜像"
#!  . 为当前所有文件
docker build -t cicd-front:1.0 .
echo "终止 并 移除 之前的容器"
docker stop cicd-front-container
docker rm cicd-front-container
echo "创建 并 启动 新容器"
docker container run -port 80:80 --name cicd-front-container -d cicd-front:1.0