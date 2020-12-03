#!/bin/bash
WORK_PATH='/usr/projects/cicd-front'
cd $WORK_PATH
echo "清除旧代码"
git reset --hard origin/master
git clean -f
echo "拉取远程代码"
git pull origin master
echo "安装依赖"
npm i
echo "开始构建"
npm run build

echo "终止 并 移除 之前的容器"
docker stop cicd-front-container
docker rm cicd-front-container
echo "移除之前的 docker 镜像"
docker rmi cicd-front:1.0 -f
echo "创建新 docker 镜像"
#! 构建镜像 . 为当前文件夹 执行路径下的 Dockerfile 配置文件
docker build -t cicd-front:1.0 .
# docker build -f ./Dockerfile -t cicd-front:1.0 .
echo "创建 并 启动 新容器"
# 错误命令 docker run -port 80:80 --name cicd-front-container -d cicd-front:1.0 
docker run -d --name cicd-front-container -p 8000:80 cicd-front:1.0
