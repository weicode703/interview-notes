---
title: SQLAlchemy 的核心概念：Engine、Session 与 N+1
category: Python 栈
tags: [SQLAlchemy, ORM, FastAPI, 面试高频]
importance: 2
mastery: 未掌握
source: AI生成
---

## 问题

FastAPI 项目里 SQLAlchemy 是怎么组织数据库访问的？Engine、Connection、Session 各管什么？
为什么要 commit/close？查询列表为什么会慢成 N+1？async 路由里用同步 ORM 会怎样？（简历项目：AIWear / 智居的 SQLAlchemy 数据层）

## 核心答案

- **三层结构**：`Engine` 管连接池与方言（进程级单例，一个数据库一个）；`Connection` 是从池里借出的一次连接；`Session` 是**工作单元（Unit of Work）**——跟踪对象变更、攒事务、统一 flush/commit。

- **Session 生命周期**：请求级——每个请求开一个 Session（FastAPI 里用依赖注入 `yield` 保证用完关闭），用完 commit 并归还连接。**Session 不是线程安全的**，跨请求共享 Session 是经典事故源。

- **N+1 问题**：查 1 次列表拿到 N 个对象，再逐个访问它们的关联属性，触发 N 次懒加载查询。解法：`selectinload`（再发一条 IN 查询批量取关联）或 `joinedload`（JOIN 一次取全）；排查靠开 `echo=True` 看真实 SQL 条数。

- **同步 ORM 进 async 路由 = 阻塞事件循环**：所有请求共享一个事件循环，同步的数据库 IO 一阻塞全部请求排队。解法：SQLAlchemy 2.0 的 async 模式（`async_sessionmaker` + asyncpg/aiomysql 驱动），或路由声明为普通 `def` 让框架丢线程池跑。

## 深度解析

- 追问点：commit、flush、close 的区别？——flush 把变更写进当前事务（可继续查到自增 ID），commit 才真正落库，close 归还连接并丢弃未提交变更。

- 追问点：连接池参数怎么定？——`pool_size`（常驻连接）+ `max_overflow`（突发借用）+ `pool_pre_ping`（借出前探活防"连接已被数据库掐断"）；uvicorn 多 worker 时总连接数 = 单 worker 池大小 × worker 数，别超过数据库 `max_connections`。

- 追问点：ORM 和 Core 怎么选？——ORM 适合业务 CRUD（对象化、可维护）；Core/原生 SQL 适合批量写、复杂报表和性能敏感路径，两者可在同一项目混用。

- 常见误区：`expire_on_commit` 默认 True——commit 后再访问对象属性会触发**重新查询**；请求内 commit 后还要读对象的话，要么关掉它要么显式 refresh。

## 我的理解

## 关联题目

- [FastAPI 为什么适合做 AI 应用服务](/python/fastapi-core)

- [PostgreSQL vs MySQL 怎么选](/python/postgres-vs-mysql)

- [MySQL 索引](/database/mysql-index)
