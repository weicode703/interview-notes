---
title: 压缩什么时候触发、保留什么、压缩后怎么找回细节？
category: Prompt 工程
tags: [上下文压缩, 水位线, 上下文工程, Agent]
importance: 3
mastery: 未掌握
source: 自整理
---

## 问题

上下文 token 怎么统计？压缩的触发阈值怎么定？摘要里必须保留哪些信息？压缩之后又需要早期对话细节，怎么恢复？

## 核心答案

**一、怎么统计 token**

优先用模型对应的 tokenizer 精确算；没有就用估算：英文约 `len/4`，中文按「1 字 ≈ 1 token」估更保守（`len/4` 会严重低估中文）。可用预算 = 窗口大小 − 预留输出 token − 工具结果余量，不是拿窗口当预算。

**二、什么时候触发：高低双水位**

- **高水位 85%**：上下文用到窗口的 85% 就触发压缩；
- **低水位 50%**：一次压到 50% 停手。

为什么是双水位而不是单阈值：贴着高水位压，只会压出一点点空间，下一轮又触发——压得太频繁，摘要调用次数多、信息反复损失；一次压到位（回到 50%），能撑住后面十几轮。压得太晚（贴着窗口上限）更糟：会挤掉工具结果、甚至直接硬截断。

**三、摘要里必须保留什么**

1. 用户目标（要做什么，做成什么样算完成）；
2. 约束与偏好（不能做什么、口径要求）；
3. 已完成部分（做过什么、结论是什么）；
4. 资料引用（文件路径、URL、文档 ID、订单号这类可回查的锚点）；
5. 未完成部分（下一步要做什么）。

**四、压缩后怎么找回早期细节**

摘要不是唯一副本。做法是「会话层留全量 + 摘要带覆盖范围 + 按需回查」：

- 会话层持久化保存完整对话，不随压缩删除；
- 摘要记录 `summary.covered`——它覆盖了哪些 entry ID（或起止边界）；
- 之后需要早期细节时，如果摘要里没有，模型调用工具去 session 文件里查原文，把相关片段补回当前上下文。

**关键**：摘要里必须留得住「能定位到原文」的信息（ID、路径、时间戳），否则压缩完就真找不回来了。

## 深度解析

**以 DeepSeek Harness 的压缩链路为例**（一条完整实现，可对照记）：

1. `shouldCompact`：估算 token 超过 `contextWindow - reserveTokens`（默认 reserveTokens=16384）时触发；
2. `findCutPoint`：从最新消息往回累计 token，累计到 `keepRecentTokens`（默认 20000）时取最近的合法切点，**不能切在 toolResult 之前**——否则模型会看到「调了工具却没结果」；
3. `generateSummary`：把被丢弃的消息序列化，用结构化 prompt 让模型产出固定格式摘要：Goal / Constraints & Preferences / Progress / Key Decisions / Next Steps / Critical Context；
4. 迭代合并：后续再压缩时用「更新版 prompt」把旧摘要 + 新消息合并，而不是每次重新全量总结；
5. split turn：切点落在某一轮中间时，额外生成 turn prefix 摘要，再合并；
6. 落盘：摘要存为 compaction entry，替换被丢弃的消息。

**三个常见坑**：

- 切点切在工具结果前 → 上下文出现「有调用无结果」，模型容易重复调工具；
- 摘要丢路径/ID → 后续无法回查，只能靠模型猜；
- 摘要误差滚动累积 → 长时间会话要定期从原文重建，而不是一路「摘要的摘要」。

## 我的理解

（留空，后续自行填写）

## 关联题目

- [上下文压缩与滚动摘要](/prompt-engineering/context-compression-rolling-summary)
- [Token Budget 分配](/prompt-engineering/token-budget-allocation)
- [Token 超限时的上下文裁剪策略](/agent-memory-tools/context-trimming)
- [Chat Memory 与 Chat History 的区别](/agent-memory-tools/chat-memory-vs-chat-history)
