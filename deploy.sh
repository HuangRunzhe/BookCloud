#!/bin/bash

# Linux服务器部署脚本
echo "🚀 开始部署家庭图书管理系统..."

# 更新系统包
echo "📦 更新系统包..."
sudo apt-get update

# 安装Python依赖
echo "🐍 安装Python依赖..."
sudo apt-get install -y python3 python3-pip python3-venv

# 安装条码扫描系统依赖
echo "📷 安装条码扫描系统依赖..."
sudo apt-get install -y libzbar0 libzbar-dev

# 安装OpenCV系统依赖
echo "🖼️ 安装OpenCV系统依赖..."
sudo apt-get install -y libopencv-dev python3-opencv

# 创建虚拟环境
echo "🔧 创建Python虚拟环境..."
python3 -m venv venv
source venv/bin/activate

# 安装Python包
echo "📚 安装Python包..."
pip install --upgrade pip
pip install -r backend/requirements-linux.txt

# 创建上传目录
echo "📁 创建上传目录..."
mkdir -p backend/uploads

# 设置权限
echo "🔐 设置文件权限..."
chmod 755 backend/uploads
chmod +x deploy.sh

echo "✅ 部署完成！"
echo ""
echo "启动服务："
echo "cd backend && source ../venv/bin/activate && uvicorn main:app --host 0.0.0.0 --port 8000"
echo ""
echo "或者使用systemd服务（推荐）："
echo "sudo cp book-management.service /etc/systemd/system/"
echo "sudo systemctl enable book-management"
echo "sudo systemctl start book-management"

