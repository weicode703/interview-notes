---
title: LangGraph 子图的 Interrupt 如何冒泡？主图网关模式
category: 框架
tags: [LangGraph, 子图, Interrupt, 面试高频]
importance: 3
mastery: 未掌握
source: AI生成
---

## 问题

把 Agent 按业务拆成多个子图（推荐、预约、查询各一个 subgraph）后，子图执行到一半发现信息不全、需要用户补充时怎么办？
interrupt 写在子图里，前端为什么不好对接？"主图网关"模式是怎么解决的？（简历项目：智居 Agent 的 recommend_input_gateway / reserve_input_gateway 双网关）

## 核心答案

- **问题本质**：子图作为节点嵌入主图执行时，人机交互协议（要问什么字段、答案怎么回去）如果散落在各个子图里，前端就要为每个子图单独写对接逻辑；且子图内的中断语义跨层暴露时 payload 结构不可控。

- **主图网关模式**：人机交互统一收敛到主图的两个网关节点——
  1. 子图不直接 interrupt，而是往消息流的 `additional_kwargs` 写结构化请求（`{"field": "budget", "question": "请补充预算"}`）；
  2. 主图的条件边检测到请求键，路由进网关节点，由网关统一调用 `interrupt()` 暂停；
  3. 用户答案 `Command(resume=...)` 恢复后，网关把值包装成带结构化标记的 HumanMessage **注回消息流**，再路由回子图继续执行。

- **三个好处**：人机交互协议只有一处实现；子图保持纯业务逻辑、不感知自己跑在什么宿主环境里；答案回注后子图拿到的是带标记的干净输入。

- **空答案校验**：网关里用顺序两次 interrupt 实现"为空重问"——resume 后该节点从头重新执行，第一个 interrupt 直接取到提交值，为空则第二个 interrupt（问题后缀"（不能为空）"）再次暂停，不需要额外状态字段。

## 深度解析

- 追问点：为什么用消息的 `additional_kwargs` 传载荷，不共享 state 字段？——LangGraph 子图有独立的 state schema，跨层共享字段会让两层 schema 耦合；消息通道携带结构化载荷，子图的输出协议就是"消息 + 附加标记"，边界清晰、各自演进。

- 追问点：LangGraph 新版本不是支持子图 interrupt 冒泡吗？——支持，但框架级冒泡的中断事件结构对前端不完全可控；网关模式的本质是把"框架行为"显式化成"应用层协议"，payload 格式、恢复路径、前端渲染都由自己定义，可控性和可调试性更强。

- 雷区：答案回注必须是新的 HumanMessage（带标记），不要直接改写共享 state——多轮对话的 checkpoint 语义靠消息流驱动，绕过消息流的修改不会被 checkpoint 正确记录。

- 延伸：这是"控制流与数据流解耦"在 HITL 场景的具体应用——交互（控制）收归主图，业务（数据）留在子图。

## 我的理解

## 关联题目

- [LangGraph 的 Interrupt 中断恢复](/frameworks/langgraph-interrupt)

- [LangGraph 的 StateGraph 三要素](/frameworks/langgraph-stategraph)

- [Human-in-the-Loop 实现](/system-design/human-in-the-loop)

- [控制流与数据流解耦](/agent-architecture/control-flow-data-flow-decoupling)
