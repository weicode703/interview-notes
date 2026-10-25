---
title: Docker 核心八股：容器 vs 虚拟机、Dockerfile 与网络
category: Python 栈
tags: [Docker, 容器, Dockerfile, 面试高频]
importance: 2
mastery: 未掌握
source: AI生成
---

## 问题

容器和虚拟机的本质区别是什么？镜像为什么是分层的？
Dockerfile 里 COPY 和 ADD、CMD 和 ENTRYPOINT 有什么区别？容器之间怎么通信？（简历项目：AIWear / 智居的 Docker Compose 五容器编排）

## 核心答案

- **容器 vs 虚拟机**：虚拟机虚拟的是**硬件**（每台带完整客户机 OS，GB 级、分钟级启动）；容器虚拟的是**运行环境**——共享宿主机内核，用 Namespace 隔离视图（进程/网络/文件系统各看各的）、Cgroups 限制资源，MB 级、秒级启动。

- **镜像分层**：镜像 = 多个只读层的叠加，Dockerfile 每条指令生成一层。好处：层可缓存复用（改代码只重建后面的层，依赖层命中缓存）、多镜像共享基础层省磁盘。容器启动时在只读层上加一个可写层（写时复制）。

- **四组易混指令**：
  - `COPY` vs `ADD`：都能拷文件进镜像；`ADD` 额外支持自动解压 tar 和 URL（行为不直观），**没这两个需求就用 COPY**；
  - `CMD` vs `ENTRYPOINT`：ENTRYPOINT 定义固定入口，CMD 给它填默认参数；docker run 带参数时覆盖的是 CMD——组合使用让镜像像命令一样可传参。

- **容器间通信**：同一 compose 文件里的服务默认进同一个 bridge 网络，**用服务名当主机名互访**（如 `postgres:5432`）——这就是为什么应用配置里写的是服务名而不是 IP。

## 深度解析

- 追问点：数据怎么持久化？——Volume（Docker 管理，`docker volume`）、bind mount（挂宿主机路径）；数据库容器不挂卷，删容器数据就没了。

- 追问点：`docker exec` 和 `docker run` 的区别？——run 基于镜像创建**新**容器；exec 进入**已在运行**的容器开新进程（排查首选 `exec -it <c> sh`）。

- 追问点：镜像变大怎么排查？——多阶段构建（builder 阶段装编译依赖，最终阶段只 COPY 产物）；`.dockerignore` 排除无关文件；警惕 `RUN` 合并层里的缓存（apt 缓存要同层清理）。

- 追问点：bridge 和 host 网络模式？——bridge（默认，容器走 NAT 有独立 IP，端口要 `-p` 映射）；host（直接用宿主机网络栈，性能好但端口冲突风险）。生产上容器端口不该直接对公网暴露，收到 Nginx/网关后面。

## 我的理解

## 关联题目

- [Docker 部署 AI 应用要注意什么？](/python/docker-deploy-llm)

- [Nginx 反向代理高频](/network/nginx-reverse-proxy)

- [Linux 与进程相关的高频](/os/process-thread)
