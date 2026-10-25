---
title: Python 并发选型：多线程、多进程、asyncio 怎么选
category: Python 栈
tags: [Python, 并发, asyncio, 面试高频]
importance: 3
mastery: 未掌握
source: AI生成
---

## 问题

Python 里做多线程、多进程、asyncio 三种并发，分别适合什么场景？
CPU 密集任务为什么多线程没用？IO 密集为什么 asyncio 更优？FastAPI 项目里怎么混着用？

## 核心答案

- **一句话决策树**：
  - **CPU 密集**（计算、编解码、向量化）→ **多进程**（multiprocessing / ProcessPoolExecutor）——绕开 GIL，多核并行；
  - **IO 密集 + 高并发**（HTTP 调用、数据库、网络）→ **asyncio**——单线程事件循环，万级连接无压力；
  - **IO 密集 + 中低并发 / 调用阻塞库**（requests、同步 DB 驱动）→ **多线程**——GIL 在 IO 等待时会释放，几十个线程够用；
  - 拿不准就看**瓶颈在哪**：CPU 满载 → 进程；CPU 闲着在等 IO → 协程/线程。

- **三者对比**：

  | | 多进程 | 多线程 | asyncio |
  |---|---|---|---|
  | 切换成本 | 高（页表/上下文） | 中（内核线程切换） | 极低（用户态函数切换） |
  | 内存 | 每进程独立解释器（重） | 共享（MB 级/线程） | 协程 KB 级 |
  | 并行 | 真并行（多核） | 伪并行（GIL） | 伪并行（单线程） |
  | 数据共享 | 进程间 IPC | 共享内存要加锁 | 单线程天然安全 |

- **FastAPI 里的混合实践**：`async def` 路由跑事件循环（配 asyncpg/async 依赖）；同步的阻塞调用（老 ORM、重计算）写成普通 `def` 路由，框架自动丢线程池；真正吃 CPU 的批量计算用 `run_in_executor(ProcessPoolExecutor)`——**三种模型在一个服务里按层分工**。

## 深度解析

- 追问点：GIL 什么时候释放？——IO 系统调用前、以及每执行一段字节码（sys.setswitchinterval）时切换——所以多线程在 IO 场景仍然有效，纯计算场景才废。

- 追问点：asyncio 的坑？——事件循环里混进一个同步阻塞调用（time.sleep、同步请求），全部协程一起卡死——这就是"同步 ORM 塞 async 路由"事故的原理。

- 追问点：多进程的代价？——进程启动慢、数据要序列化传输（pickle）、共享状态要 Manager/队列——适合"大块独立的计算任务"，不适合频繁小任务。

- 常见误区：给 CPU 密集任务上 asyncio——协程不能并行计算，只会把 CPU 密集任务串得更整齐；也别给几千个长连接上多线程——线程内存和切换开销会先爆。

## 我的理解

## 关联题目

- [GIL 是什么？多线程为什么不能并行](/python/python-gil)

- [asyncio 事件循环与异步编程](/python/python-asyncio)

- [进程与线程的区别](/os/process-thread)
