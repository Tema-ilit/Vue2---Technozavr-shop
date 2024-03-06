#!usr/bin/env sh

# оставить публикацию при ошибках
set -e

# сборка приложения 
npm run build

#переход в каталог сборки
cd dist

#иницилизация репозитория и загрузка кода в GitHub
git init
git remote add origin https://github.com/Tema-ilit/Vue2---Technozavr-shop.git
git add .
git commit -m 'deploy'
git push origin master