---
title: TCP 粘包与拆包：原因与解决
category: 计算机网络
tags: [TCP, 粘包, 网络, 面试高频]
importance: 2
mastery: 未掌握
source: AI生成
---

## 问题

TCP 是字节流协议，没有消息边界——发送方两次 write，接收方可能一次 read 全收到（粘包），也可能一次消息被拆成两半读（拆包）。
为什么会这样？怎么解决？

## 核心答案

- **本质原因**：TCP 传输的是**无边界的字节流**，"包"是应用层的概念。Nagle 算法合并小包、接收缓冲区一次取走多段数据、MSS 分段——都会让"应用层消息"和"传输层读写次数"不对齐。**这不是 TCP 的 bug，是字节流的本性**（UDP 有数据报边界，就不存在粘包）。

- **四种定界方案**：
  1. **固定长度**：每条消息定长，不足补齐——简单但浪费带宽；
  2. **分隔符**：消息尾加 `\r\n` 之类——要处理转义（正文里出现分隔符）；
  3. **长度前缀（主流）**：消息头固定 N 字节写明包体长度，接收方先读头再按长度读体——自定义协议的标准做法；
  4. **直接用带边界的应用层协议**：HTTP 的 Content-Length/chunked、Redis RESP、WebSocket 帧——都是在干这件事。

## 深度解析

- 追问点：接收端怎么优雅实现拆包？——维护一个缓冲区，循环判断"缓冲区长度 ≥ 头部长度？≥ 头部声明的完整长度？"，不够就继续攒；Netty 的 LengthFieldBasedFrameDecoder 就是这个逻辑的现成实现。

- 追问点：SSE 为什么不怕粘包？——SSE 跑在 HTTP 上，HTTP 用 Content-Length/Transfer-Encoding 已经解决了边界问题，SSE 只是约定了 `data:` 行 + 空行分隔事件，是文本层协议。

- 常见误区：说"TCP 会丢包所以粘包"——丢包重传是可靠性，粘包是流式性，两回事；UDP 既不粘也不拆（但有消息丢失/乱序问题）。

## 我的理解

## 关联题目

- [TCP 与 UDP 的区别](/network/tcp-udp)

- [TCP 如何保证可靠传输](/network/how-tcp-ensures-reliability)

- [SSE 事件协议设计与缓冲排查](/evaluation-deployment/sse-event-protocol-design)
