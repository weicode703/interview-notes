---
title: PostgreSQL 的 MVCC 与 VACUUM
category: 数据库
tags: [PostgreSQL, MVCC, VACUUM, 面试高频]
importance: 2
mastery: 未掌握
source: AI生成
---

## 问题

PostgreSQL 实现快照隔离不靠锁，靠什么？表明明没多少行，为什么磁盘和表膨胀得离谱？
VACUUM 在清什么？（简历项目：智居 Agent 用 PG 存 LangGraph 线程状态，频繁写更新的场景正中本题）

## 核心答案

- **PG 的 MVCC：多版本行**——UPDATE/DELETE **不原地改**，而是给旧版本打标记（tuple 的 xmin/xmax 事务号），插入新版本行；每个事务按快照决定"哪个版本的行对我可见"。读不加锁、写不堵读，靠版本链换来的并发。

- **代价：死元组（dead tuples）**——没有任何事务还需要旧版本时，它成了占着磁盘的"尸体"。频繁 UPDATE 的表会积累大量死元组：**表膨胀**（文件变大、扫描变慢、索引变大），这是 PG 最著名的运维问题。

- **VACUUM 就是清尸队**：回收死元组空间（还给表内复用，文件不一定缩小）、清理事务号回卷（防 20 亿事务用尽冻结）、更新统计信息（帮优化器）。普通 VACUUM 不锁表；`VACUUM FULL` 重建整表能真正缩文件但要排他锁。

- **自动清理（autovacuum）**：后台按死元组比例阈值自动跑——高频更新的表要调低阈值，别等它"默认触发太晚导致膨胀"。

## 深度解析

- 追问点：和 MySQL InnoDB 的 MVCC 区别？——InnoDB 旧版本放在 **undo log** 里回滚链实现，后台 purge 清理；PG 是**堆表里真实存着多版本行**。所以 PG 会表膨胀、InnoDB 会有大事务 undo 膨胀——代价形态不同，思想相同。

- 追问点：LangGraph 的 checkpoint 存 PG 为什么要关心这个？——每次图执行都写新状态行，旧 checkpoint 变死元组，是典型的"高频写"画像；依赖 autovacuum 不如主动监控 `pg_stat_user_tables` 的 dead_tup 比例。

- 追问点：长事务为什么危险？——长事务的快照"钉住"了旧版本——它还可能要看，VACUUM 就不能清，死元组一直堆积。`SELECT pg_stat_activity` 查长事务是 PG 排查标配。

- 常见误区：删了 100 万行以为磁盘立刻缩小——空间只标记为可复用，文件缩小要 VACUUM FULL（或 pg_repack 在线重建）。

## 我的理解

## 关联题目

- [PostgreSQL 与 MySQL 怎么选](/python/postgres-vs-mysql)

- [MySQL 事务隔离级别](/database/mysql-transaction-isolation)

- [MySQL 的 redo/undo/binlog](/database/mysql-redo-undo-binlog)
