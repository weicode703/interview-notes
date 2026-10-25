---
title: Nginx 反向代理高频：proxy_pass、负载均衡与缓冲
category: 计算机网络
tags: [Nginx, 反向代理, 负载均衡, 面试高频]
importance: 2
mastery: 未掌握
source: AI生成
---

## 问题

Nginx 在你的部署架构里干什么？正向代理和反向代理的区别是什么？
负载均衡有哪些策略？upstream 配置怎么写？为什么加了 Nginx 之后 SSE/流式接口会"一次性蹦出全部内容"？（简历项目：AIWear 的 Nginx 反代与 SSE 踩坑）

## 核心答案

- **正向 vs 反向**：正向代理代理**客户端**（翻墙/公司出口，服务端不知道真实客户端是谁）；反向代理代理**服务端**（用户只认识 Nginx，后端服务对用户透明）。部署架构里 Nginx 干三件事：反向代理（`proxy_pass` 转发给 FastAPI/后端）、静态资源托管（前端产物直接由 Nginx 返回，不打到应用）、TLS 终结与端口收口（应用容器不对外暴露）。

- **负载均衡策略**：轮询（默认）、加权轮询（`weight`，机器不均时）、`ip_hash`（同一客户端固定打到同一后端——会话保持，但后端挂了会重分布）、`least_conn`（最少连接，长连接/SSE 场景更公平）。

- **SSE/流式被缓冲的经典坑**：`proxy_buffering on` 是默认值，Nginx 会把上游响应攒进缓冲区再转发——流式的几十个 chunk 被攒成一坨。修复双侧落地：Nginx 侧 `proxy_buffering off; gzip off;`；应用侧加响应头 `X-Accel-Buffering: no` 让 Nginx 见头自动关缓冲。

- **其他高频指令**：`proxy_set_header Host/X-Real-IP/X-Forwarded-For`（把真实客户端信息传给后端，不然后端看到的全是 Nginx 的 IP）；`proxy_read_timeout`（SSE 长连接要调大，默认 60s 会掐断空闲流）。

## 深度解析

- 追问点：为什么静态资源让 Nginx 托管而不是后端？——Nginx 发静态文件是零业务逻辑的事件驱动路径，吞吐远高于应用容器；应用只处理 API，各干各擅长的事。

- 追问点：gzip 对 SSE 的影响？——gzip 需要攒够数据再压缩输出，本身就是一种缓冲；流式接口的 location 里要显式 `gzip off`。

- 追问点：四层和七层负载均衡的区别？——Nginx 默认七层（看得到 HTTP，能按路径/Header 分流）；LVS/云 LB 常做四层（只转 TCP 流量，性能更高）。Nginx 也能做 stream 四层，但主流用法是七层。

- 雷区：改了 Nginx 配置只 reload 应用不 reload Nginx（或反之）——两层配置要同步变更，`nginx -t` 先测再 reload。

## 我的理解

## 关联题目

- [SSE 事件协议设计与缓冲排查](/evaluation-deployment/sse-event-protocol-design)

- [HTTP / HTTPS](/network/http-https)

- [Docker 部署 AI 应用要注意什么？](/python/docker-deploy-llm)
