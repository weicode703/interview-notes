---
title: Prefix Caching 与 Prompt Caching：原理与命中率优化
category: LLM 基础
tags: [KV Cache, Prompt Caching, 推理优化, 面试高频]
importance: 2
mastery: 未掌握
source: 自整理
---

## 问题

Prefix Caching 是什么？Prompt Caching 又是什么，怎么提高命中率？它和 KV Cache 是什么关系？

## 核心答案

**一句话区分三者**：KV Cache 管「一次请求内不重算」，Prefix Caching 管「跨请求复用相同前缀」，Prompt Caching 是这件事在 API 层的产品形态。

**KV Cache**：自回归生成时，已算过的 token 的 K/V 留在显存里，每生成一个新 token 只算这一个新词，不回算历史。它是单次请求内的优化。

**Prefix Caching**：多个请求的开头常常相同（System Prompt、工具定义、长文档、few-shot 示例）。服务端把公共前缀的 K/V 放进共享缓存池，命中就直接复用，**跳过 prefill 阶段**——省的是首字延迟（TTFT）和算力。PagedAttention 的 block 共享是实现基础之一。

**Prompt Caching（API 层）**：同一件事的显式版本。把稳定前缀打上缓存标记，后续请求命中后按折扣价计费、延迟更低。与自动 prefix 缓存的差别：

| 维度 | Prefix Caching | Prompt Caching（API） |
| --- | --- | --- |
| 触发 | 引擎自动按前缀匹配 | 显式标记缓存断点 |
| 粒度 | 按 block / 前缀哈希 | 按你划的段落 |
| 约束 | 前缀要一致 | 通常有最小 token 数、TTL 限制 |

**提高命中率的四件事**：

1. **前缀稳定**：不变的内容（系统提示、工具清单、长文档）放最前面，变化的用户输入放最后——前面一段变了，后面全失效；
2. **前缀够长**：低于服务商的最小缓存长度不生效，短 prompt 折腾缓存没意义；
3. **控制 TTL**：缓存有寿命，请求稀疏的场景等第二次来早过期了；
4. **顺序固定**：工具定义的顺序、字段顺序都要固定，序列化结果一变哈希就变。

## 深度解析

- **什么场景不划算**：一次性长上下文（用完不再来）、前缀频繁变动、请求极稀疏。此时省不下钱，还可能因为额外的缓存管理逻辑增加复杂度。
- **和成本题的关系**：RAG 应用里「检索结果」是变化的，「系统提示 + 工具定义」是稳定的，把后者做成缓存前缀是性价比最高的一刀。
- **常见误区**：把 Prefix Caching 和语义缓存混为一谈。语义缓存是「问题相似就返回上次的答案」，属于结果复用，有答非所问的风险；前缀缓存复用的是**计算过程**，答案还是现场生成的。
- **面试加分点**：能说清「prefill 是算力瓶颈、decode 是访存瓶颈」——前缀缓存省的是 prefill，所以对长输入场景收益最大。

## 我的理解

（留空，后续自行填写）

## 关联题目

- [KV Cache](/llm-basics/kv-cache)
- [LLM 应用成本控制](/evaluation-deployment/cost-optimization)
- [LLM 推理性能优化](/evaluation-deployment/inference-optimization)
- [Token Budget 分配](/prompt-engineering/token-budget-allocation)
