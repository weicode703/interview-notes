---
title: 线程池、进程池与并发容量参数怎么定
category: Python 栈
tags: [线程池, 连接池, 容量规划, 面试高频]
importance: 2
mastery: 未掌握
source: AI生成
---

## 问题

concurrent.futures 的线程池/进程池参数怎么定？uvicorn 开几个 worker？
数据库连接池配多大？这些数字之间有没有约束关系？

## 核心答案

- **池的本质是排队而非并行**：池上限决定的不是"能处理多少请求"，而是"同时处理多少 + 剩下的排队"——上限保护的是**下游资源**（数据库、内存），不是吞吐。

- **参数的推导逻辑（不是背数字）**：
  - **线程池**（IO 密集）：上限 ≈ 并发 IO 等待数，几十到一、二百（线程本身耗内存约 MB 级）；过大反而切换开销上升；
  - **进程池**（CPU 密集）：等于 CPU 核数或核数−1——再多也是排队等核；
  - **uvicorn/gunicorn worker**：`CPU 核数 × 2 + 1` 是经典起点，内存重（加载模型）的服务按内存反推；
  - **DB 连接池**（单 worker）：`pool_size + max_overflow`，且 **所有 worker 的总连接数 ≤ 数据库 max_connections**——这是最常被漏掉的乘法。

- **全链路容量约束**：吞吐上限 = min(各层容量)。Web 层 worker × 每请求占用 DB 连接时间 → 决定需要的连接池大小；反过来连接池打满时请求会在拿连接处排队（表现为 RT 上升而非报错）——**压测时看到的"变慢不报错"多半是某一层池满了**。

## 深度解析

- 追问点：为什么队列也要有界？——无界队列 = OOM 延迟爆炸（请求堆积在内存里）；有界 + 拒绝策略（拒绝/降级）才是正确姿势，和 MQ 积压一个道理。

- 追问点：FastAPI 的 def 路由用哪个池？——Starlette 的默认线程池（anyio，默认 40 线程），同步路由多了要显式调大或改 async。

- 追问点：压测发现 P99 飙高但 CPU 很闲？——大概率是排队：看各池的等待指标（DB 连接等待、线程池队列长度），而不是加机器——容量问题先定位瓶颈层再扩。

- 常见误区：把 worker 开成 CPU 核数的 10 倍"求高并发"——IO 密集多 worker 有效，但每 worker 都要加载独立内存（模型场景直接 OOM），且 DB 连接总数爆掉。

## 我的理解

## 关联题目

- [Python 并发选型](/python/python-concurrency-selection)

- [SQLAlchemy 核心概念](/python/sqlalchemy-core-concepts)

- [压力测试怎么做：指标、工具与找水位](/evaluation-deployment/load-testing-methodology)
