---
title: Coding Agent 的长期记忆怎么实现？（Claude Code 与 Codex）
category: 记忆与工具
tags: [长期记忆, Coding Agent, 记忆治理, Agent]
importance: 2
mastery: 未掌握
source: 自整理
---

## 问题

Claude Code 和 Codex 分别怎么存、怎么取长期记忆？两者的设计哲学差在哪？

## 核心答案

**Claude Code：文件 + 索引 + 按需加载**

- 两层：第一层 `CLAUDE.md`，用户自己写的项目规则，放项目根目录，直接注入上下文；第二层 memory 目录，Agent 自己生成，分四类——`user`（你是谁）、`feedback`（你纠正过的做法）、`project`（项目状态）、`reference`（外部资料地址）；
- 写入：自动（模型判断哪些值得保留）+ 手动（用户指定）；
- 读取：每次新开会话先读 `MEMORY.md` 这个索引文件，再加载具体的记忆文件。

**Codex：数据库 + 使用频率淘汰 + 分层**

1. 每次开新任务时，后台处理之前的旧任务，判断「这段记忆存下来，以后表现会不会更好」，不会就不存；
2. 值得存的写进 SQLite，每条带两个指标：`usage_count`（被引用几次）、`last_usage`（最后引用时间）——用得多的排前面，长期不用的逐渐淘汰；
3. 取用时先捞排名靠前的一批，再起一个子 Agent 把它们分门别类：`summary`（高密度用户画像，新任务自动注入上下文）、`memory`（操作手册，关键词检索）、`rollout_summaries`（失败经验与项目知识）。

**两种哲学**：Claude Code 偏「文本文件」——可读、可改、能进版本库；Codex 偏「数据库」——自动治理、有生命周期、靠频率决定去留。**共同点是都不把全量历史塞回上下文**。

## 深度解析

- **为什么都做分层**：全量注入太贵，全靠检索又漏；所以是「少量固定注入（画像/规则）+ 大量按需检索（手册/经验）」。
- **淘汰机制的意义**：记忆不清理，会越积越多、越来越旧，模型拿到过期信息比没有信息更糟。
- **可迁移的设计经验**：写入前先判断价值、写入时带元数据（时间、来源、使用次数）、读取时分固定注入和按需检索两层——这三条和你自己给 Agent 做记忆系统是一回事。

## 我的理解

（留空，后续自行填写）

## 关联题目

- [短期记忆与长期记忆的设计与落地](/agent-memory-tools/working-vs-long-term-memory)
- [Agent 怎么自进化：记忆与 Skill 两条线](/agent-memory-tools/self-evolving-agent)
- [对话记忆持久化](/agent-memory-tools/memory-persistence)
- [长期记忆框架（Mem0 / Zep）](/agent-memory-tools/long-term-memory-frameworks)
