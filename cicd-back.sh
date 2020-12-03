#!/bin/bash
WORK_PATH='/usr/projects/cicd-back'
cd $WORK_PATH
echo "清除旧代码"
git reset --hard origin/master
git clean -f
echo "拉取远程代码"
git pull origin master
echo "创建docke 镜像"
#! 构建镜像 . 为当前文件夹 执行路径下的 Dockerfile 配置文件
docker build -t cicd-back:1.0 .
echo "终止 并 移除 之前的容器"
docker stop cicd-back-container
docker rm cicd-back-container
echo "创建 并 启动 新容器"
docker container run -port 5000:5000 --name cicd-back-container -d cicd-back:1.0