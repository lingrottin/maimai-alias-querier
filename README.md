# maimai-alias-querier
提供 API 的 maimai 谱面别名查询系统  
**注意，不是 RESTful API！这个 API 不符合 RESTful 风格！！**

## 截图
![首页](/assets/query.webp) <br/>
![查询](/assets/query_success.webp) <br/>
![提交](/assets/submit.webp) <br/>
![提交成功](/assets/submit_success.webp) <br/>
![审核](/assets/review.webp) <br/>

## 部署
下载本仓库，**使用终端**进入文件夹，输入<br/><br/>
Windows:

```powershell
./build.ps1
npm run start
```
<br/>
Linux:

```bash
chmod +x ./build.sh
./build.sh
npm run start
```

## 配置

- Service:
  - listen: 监听地址
  - port: 监听端口
- Data:
  - path: 别名数据库 (JSON) 路径
  - submit_path: 提交数据库路径
  - review_token: 审核令牌，类似于密码，**请务必更改默认令牌**！

## 致谢
本项目使用了
- [Expreess](https://expressjs.com/) - 服务器框架
- [Bootstrap](https://getbootstrap.com/) - 前端框架
- [MDBootstrap](https://mdbootstrap.com/) - 专用于 Bootstrap 的 Material Design 风格组件库
- [Material Design Components](https://material.io/) - 来自 Google 官方的 Material Design 组件库
- [TOML Node](https://github.com/BinaryMuse/toml-node) - TOML 解析器
- **[Node.js](https://nodejs.org/en/) - 运行平台**  

衷心对以上项目的贡献者致谢。
