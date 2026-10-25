---
title: Redis 过期删除与内存淘汰策略
category: 数据库
tags: [Redis, 过期删除, 内存淘汰, 面试高频]
importance: 2
mastery: 未掌握
source: AI生成
---

## 问题

给 key 设了 TTL，到期后 Redis 怎么删？内存满了怎么办？
过期删除和内存淘汰是同一件事吗？（简历项目：Redis Token 黑名单的 TTL 设计）

## 核心答案

- **两件事，别混**：过期删除管"到期了的 key 怎么删"；内存淘汰管"内存不够了牺牲谁"。

- **过期删除 = 惰性 + 定期**：
  - **惰性删除**：访问 key 时才检查过期，过期即删——CPU 友好，但没人访问的过期 key 会赖着占内存；
  - **定期删除**：后台周期性随机抽一批带 TTL 的 key 检查，过期比例高就继续抽（限制时长防卡死）——兜住"过期但没人访问"的漏洞；
  - 两者配合是 CPU 和内存的折中，单独用哪个都不行。

- **内存淘汰（maxmemory-policy，8 种）**，按使用频率记三类：
  - `noeviction`：写报错（默认，出问题最早知道）；
  - `allkeys-lru` / `volatile-lru`：最久未使用的先走（缓存场景首选 allkeys-lru）；
  - `volatile-ttl` / `allkeys-lfu` / 随机几兄弟：按剩余寿命 / 访问频率 / 抽签。

- **Token 黑名单的 TTL 是这个机制的直接应用**：登出时写入 jti，TTL = Token 剩余有效期——**到期自动消失，黑名单永不膨胀**，就是靠惰性+定期删除兜底。

## 深度解析

- 追问点：过期 key 在删除前还占内存吗？——占，且持久化/主从复制时从库过期判断以主库删除为准（从库不主动删），有短暂不一致窗口。

- 追问点：缓存场景选哪个策略？——纯缓存 `allkeys-lru`（所有 key 都是可牺牲的缓存数据）；Redis 里同时存了不能丢的数据（如分布式锁、黑名单）就绝不能用 allkeys-*，只能 volatile-*（只淘汰带 TTL 的）。

- 追问点：LFU 和 LRU 的区别？——LRU 看"最近有没有用"（偶发批量扫描会污染），LFU 看"用得频不频"（新 key 有保护期），热点稳定的场景 LFU 更准。

- 常见误区：以为 TTL 到了 Redis 会"准点删除"——没有定时器盯着每个 key，到期后可能还活到被访问或被定期任务扫到。

## 我的理解

## 关联题目

- [JWT 怎么主动失效？](/network/jwt-active-invalidation)

- [Redis 缓存穿透、击穿、雪崩](/database/redis-cache-issues)

- [Redis 为什么快？](/database/redis-why-fast)
