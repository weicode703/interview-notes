---
title: MCP 有哪几种传输模式？一次调用完整流程是什么？
category: 记忆与工具
tags: [MCP, 协议设计, 工具调用, Agent 架构]
importance: 2
mastery: 未掌握
source: 自整理
---

## 问题

MCP 的 stdio 和 Streamable HTTP 有什么区别？旧的 HTTP+SSE 为什么被废弃？一次 MCP 调用从头到尾经过哪些步骤？

## 核心答案

**现行两种传输模式**：

- **stdio**：客户端直接 fork 一个 server 子进程，用 stdin / stdout 交换 JSON-RPC 消息，**不走网络**，延迟极低，适合本地部署的 MCP 服务（读写本机文件、跑本地命令）。
- **Streamable HTTP**：server 暴露一个 HTTP 端点，客户端 POST JSON-RPC 请求；响应可以是单个 JSON，也可以用 SSE 流式返回多条消息。适合远程服务、多客户端共享。

**已废弃：HTTP + SSE**。旧做法是先 GET 建一条长 SSE 连接，再 POST 发请求，server 通过那条 SSE 单向推送。问题是双通道、连接生命周期难管、无状态部署几乎做不了——一个端点收成一个，就是现在的 Streamable HTTP。

**一次调用的完整流程**：

```text
启动客户端 → 连接 server
initialize（协商协议版本、交换 capabilities）
initialized 通知（握手完成）
tools/list（拿工具清单，缓存）
tools/call（带参数执行）
结果回填模型 → 模型生成最终回答或继续调下一个
```

## 深度解析

- **stdio 的代价**：每个客户端一个进程，进程生命周期跟着会话走；**日志必须走 stderr**，写进 stdout 会污染协议帧，这是本地调试最常见的坑。多用户场景还得自己上进程池（见部署题）。
- **Streamable HTTP 的代价**：鉴权、限流、会话标识（Mcp-Session-Id）、断线重连都得自己做；好处是能水平扩容、多租户共享。
- **选型口诀**：本机文件/命令类工具走 stdio；SaaS、共享服务、跨网络多用户走 Streamable HTTP。同一个 MCP server 两种都能实现时，优先看「谁来调、调它的客户端有几个」。

## 我的理解

（留空，后续自行填写）

## 关联题目

- [工具设计原则与 MCP](/agent-memory-tools/tool-design-principles-mcp)
- [要让你写一个 MCP 应该怎么做](/agent-memory-tools/mcp-server-implementation-steps)
- [MCP 服务怎么部署：多用户隔离、并发与故障处理](/system-design/mcp-deployment-concurrency)
- [MCP 有哪些安全风险](/evaluation-deployment/mcp-security-risks)
