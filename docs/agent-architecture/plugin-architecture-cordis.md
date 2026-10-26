---
title: 「一切皆插件」的 Agent Runtime 长什么样？
category: Agent 架构
tags: [Agent Runtime, Harness, 插件化, 架构设计]
importance: 2
mastery: 未掌握
source: 自整理
---

## 问题

「万物皆插件」到底指什么？连 agent loop 都是插件意味着什么？Cordis 是什么？

## 核心答案

**没有特权核心**：模型适配器、工具注册表、会话日志、持久化、沙箱、审批策略，**连 agent 主循环本身**，全部是挂在同一个上下文上的插件，每一个都能从配置里替换或覆盖。

**loop 只是默认驱动**：AgentLoop 只是实现了 Agent 接口的一个默认实现（`ctx.agentLoop`），不是硬编码的主循环。要换调度策略，挂另一个实现；要拦截行为，监听 `agent/*` 事件。

**Cordis 的四个部分**：

1. **Context**：服务仓库，服务挂在 `ctx.<key>` 上（如 `ctx.tools`）；
2. **Service / Plugin**：功能单元，实现 Service 接口后挂进 context；
3. **inject**：声明依赖，插件自动等依赖服务就绪才加载——**加载顺序由依赖表达，不靠手写启动顺序**；
4. **effect**：一切注册都是可逆副作用（`ctx.effect()` / `ctx.on()`），卸载或热更新时自动回滚。

**代价也要说**：依赖关系变复杂（顺序靠依赖声明，出错难查）、调试链路变长（得先判断是哪个插件的问题）、多一层间接调用。

## 深度解析

- **为什么值得**：可替换（不锁死模型和框架）、可组合（按需拼装）、可回滚（热更新安全）、可测试（每块能单独用替身）。
- **判断一个 harness 是不是真插件化**，看三件事：核心循环能否替换、注册是否可逆、配置能否覆盖而不改代码。任何一条不满足，都是「伪插件」。
- **和面试的关系**：这类题考的不是你记不记得某个框架的名词，而是你能不能讲清「哪些部分应该是可替换的、为什么」。答的时候先说设计意图，再落具体实现。

## 我的理解

（留空，后续自行填写）

## 关联题目

- [模型负责什么、代码负责什么？Harness 工程包含哪些模块](/agent-architecture/coding-agent-harness-modules)
- [选开源框架构建 Agent Runtime 看哪些维度](/frameworks/agent-runtime-cloud-migration)
- [Agent 执行循环与状态化设计](/agent-architecture/agent-execution-loop-state)
- [Checkpoint 机制](/agent-architecture/checkpoint-mechanism)
