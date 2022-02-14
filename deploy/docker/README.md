# docker 部署

通过 docker，结合 git hook 完成自动部署。

设置步骤：

1. 生成 SSH key，并设置到 github 仓库的 Deploy Keys。用于`git pull`；
2. 服务如需外网访问或 webhook，请配置 nginx 服务器;
3. 如需 hook，请 github webhooks 配置，添加一个 webhook，设置为`push`，并设置`content_type`为`application/json`(hook 链接,参考[git-webhook-docker](https://github.com/funnyzak/git-webhook-docker#readme))；
4. 复制一份 config-default.js 配置文件，并根据启动的 NODE_ENV，修改对应的配置（如 NODE_ENV=production，那么配置文件为：config-production.js）；
5. 如果需要 build notify，需要在 compose 配置消息服务的 Token。
6. 检查各项配置，并在项目目录 `docker-compose up -d` 启动，把配置文件放到 code/config 下，重新启动应用容器。

## 生成 SSH Key

```bash
 ssh-keygen -t rsa -b 4096 -C "silenceace@gmail.com" -N "" -f ./ssh/id_rsa
```
