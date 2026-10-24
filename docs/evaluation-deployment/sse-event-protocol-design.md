---
title: SSE 事件协议怎么设计？流式被代理缓冲怎么排查？
category: 评估与部署
tags: [SSE, 流式输出, 排查, 面试高频]
importance: 2
mastery: 未掌握
source: AI生成
---

## 问题

给 RAG 问答做 SSE 流式输出：事件类型怎么划分才能让用户"全程有感知"？
更常见的坑：本地逐字输出好好的，上了 Nginx / 网关之后变成等几秒一次性蹦出全部——每一层都可能缓冲，怎么逐层排查？（简历项目：AIWear 五类 SSE 事件 + proxy_buffering 踩坑）

## 核心答案

- **事件协议设计（不止一种 delta）**：按用户等待阶段划分事件类型——
  - `start`：请求受理即发（带会话 ID），前端立刻进入"思考中"，**不等任何检索**；
  - `progress`：阶段进度（"正在检索知识库"），覆盖检索期的空白；
  - `delta`：正文增量片段，逐段渲染；
  - `done` / `error`：终态，携带来源/统计或错误信息。
  设计原则：**用户等待的每一段都有对应事件**，首字延迟的体感被进度事件摊薄。

- **缓冲排查（分层二分法）**：
  1. 先验 LLM 层：确认 SDK 流式参数开着（如 `stream=True, incremental_output=True`）；
  2. `curl -N` 直打后端 SSE 接口——逐块到达说明应用层没问题，一次性到达问题在应用内部；
  3. 应用没问题就查中间层：**Nginx 反代默认 `proxy_buffering on`**，会把上游攒满缓冲区再转发——SSE 的几十个 chunk 被攒成一坨；
  4. 修复双侧落地：Nginx 侧 `proxy_buffering off; gzip off;`（gzip 也会攒缓冲）；应用侧响应头 `X-Accel-Buffering: no` + `Cache-Control: no-cache` 双保险。

## 深度解析

- 追问点：为什么 SSE 而不是 WebSocket？——问答是单向推送，SSE 复用 HTTP、自带重连、代理友好；WebSocket 的双向能力用不上还要额外维护连接协议。

- 追问点：SDK 版本坑？——同一家的流式 SDK 不同版本可能返回**累积全文**或**增量**，按增量处理就显示错乱；归一化：前缀比对（`text.startswith(previous)` 则裁掉前缀），把两种形态统一成增量。

- 追问点：降级路径的流式体验？——模型全挂走本地兜底时，把兜底文本切块伪流式输出，保持前端交互一致；但要在事件里标记来源（如 `source: fallback`），不能让用户以为拿到了模型答案。

- 雷区：只在 Nginx 改配置不改应用头（或反之）——换一层部署环境（CDN、API 网关）就复发；双侧落地才是稳态。

## 我的理解

## 关联题目

- [流式处理与稳定性](/evaluation-deployment/streaming-stability)

- [LangGraph 的 Streaming API 与前后端实时通信](/frameworks/langgraph-streaming)

- [流式响应与 SSE](/system-design/streaming-sse)
