---
title: Redis 大 Key 与热 Key 问题
category: 数据库
tags: [Redis, 大Key, 热Key, 面试高频]
importance: 2
mastery: 未掌握
source: AI生成
---

## 问题

什么是大 Key、热 Key？各会引发什么事故？
怎么发现、怎么治理？（简历项目：AIWear 的 Redis 用户级向量索引就有大 Key 风险，值得主动聊）

## 核心答案

- **定义与危害**：
  - **大 Key**：value 过大（如百万元素的 Hash/List、几 MB 的 String）——读写耗时长，**阻塞单线程**拖慢全库；删除/过期时引发主从同步风暴；集群模式下数据倾斜；
  - **热 Key**：访问集中在个别 key（如爆款商品、某大 V 的缓存）——单分片 QPS 打满，其他分片闲着；缓存失效瞬间击穿到 DB。

- **发现手段**：`redis-cli --bigkeys`（抽样扫）、`--hotkeys`（需 LFU 策略）、RDB 离线分析工具、监控面板看分片流量倾斜。

- **治理**：
  - 大 Key：**拆**（大 Hash 按 field 哈希拆成 N 个小 key）、压缩 value、能不放 Redis 就不放（对象存储 + 只存引用）；删除用 `unlink`（异步）不用 `del`；
  - 热 Key：**本地缓存**兜一层（进程内 LRU 挡 90% 读）、key 加随机后缀打散到多分片、读扩散变写扩散。

## 深度解析

- 追问点：向量索引为什么容易成大 Key？——每用户一个集合 key 挂全部图片向量，重度用户会膨胀成天然大 Key；治理思路：按用户分 key 本身已经是拆分，剩余风险在单用户图片量，超过阈值迁移到按页/分桶结构或干脆进 pgvector。

- 追问点：`del` 和 `unlink` 的区别？——del 同步删除（大 key 阻塞主线程），unlink 只摘引用、真正释放在后台线程——4.0+ 治理大 Key 的标配。

- 追问点：大 Key 删除还有什么坑？——一次性 unlink 巨型 key 也会让后台线程忙；渐进式清空（hscan + 分批 hdel）是最后手段。

- 常见误区：把"大 Key"理解成 key 名字长——大 Key 说的是 **value 体积/元素数**，跟名字无关。

## 我的理解

## 关联题目

- [Redis 为什么快？](/database/redis-why-fast)

- [Redis 数据结构与应用场景](/database/redis-data-structures)

- [自建检索 vs 向量数据库](/rag/self-built-retrieval-vs-vector-db)
