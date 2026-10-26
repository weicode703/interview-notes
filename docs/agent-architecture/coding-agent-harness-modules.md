---
title: 模型负责什么、代码负责什么？Harness 工程包含哪些模块？
category: Agent 架构
tags: [Coding Agent, Harness, Agent Runtime, 面试真题]
importance: 3
mastery: 未掌握
source: 牛客网面经
---

## 问题

字节剪映 AI 应用开发一面，围绕候选人的开源 Coding Agent 项目追问（保留原始问法与顺序）：

- 在这个项目中，模型负责哪些功能，代码负责哪些功能？
- 相比直接在 ChatGPT 中聊天，你的 Agent 多了哪些步骤和特有能力？
- 模型外面的 Harness 工程包含哪些模块？还有哪些模块需要考虑？

## 核心答案

**分工一句话**：模型负责推理与决策（理解需求、选工具、定参数、判断结果够不够），代码负责 Harness（把上下文装配好、把工具真正执行、把状态存下来、把边界守住、把错误接住）。模型是判断者，Harness 是执行者 + 约束者 + 记录者。

**Harness 五要素**：

1. **context（上下文）**：装配 system prompt、历史、检索资料、工具结果，管预算与压缩；
2. **tools（工具）**：注册、Schema 校验、执行、结果回填、并发与超时；
3. **guardrails（约束）**：权限、沙箱、审批、路径围栏——默认拒绝、显式放行；
4. **evaluation（可验证）**：trace、断言、回归集、线上回读，不接受"我觉得没问题"；
5. **recovery（失败处理）**：重试与退避、幂等、降级熔断、checkpoint 续跑。

**和直接聊天的差别**：多了「能行动」「有状态」「有边界」三件事，也就多出了这三类故障——工具调错、状态丢失、越权执行。Harness 的模块基本就是围着这三件事长出来的。

## 深度解析

## 我的理解

（留空，后续自行填写。可思考：模型负责推理与决策，代码负责 Harness——工具执行、上下文装配、持久化、权限控制、循环终止条件、错误重试；与纯聊天的差别就在「能行动、有状态、有边界」。）

## 关联题目

- [Agent 四大组件](/agent-architecture/agent-four-components)
- [Agent 执行循环与状态](/agent-architecture/agent-execution-loop-state)
- [工具调用全链路与读文件边界设计](/agent-memory-tools/tool-call-full-chain-read-file-edge)
- [如果选择开源框架构建 Agent Runtime，从哪些维度选型](/frameworks/agent-runtime-cloud-migration)

## 原始面经

> 节选自《字节剪映AI应用开发一面》第 11–13 题（后面紧接工具调用全链路四连问）：
>
> 11. 在这个项目中，模型负责哪些功能，代码负责哪些功能？
> 12. 相比直接在 ChatGPT 中聊天，你的 Agent 多了哪些步骤和特有能力？
> 13. 模型外面的 Harness 工程包含哪些模块？还有哪些模块需要考虑？
>
> 来源：牛客网面经 https://www.nowcoder.com/feed/main/detail/7211e82c75284d23a89b569cd9dc289d
