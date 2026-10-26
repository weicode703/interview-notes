---
title: Agent 执行到一半用户插话，怎么处理？
category: Agent 架构
tags: [Human-in-the-Loop, 交互设计, Agent Runtime]
importance: 2
mastery: 未掌握
source: 自整理
---

## 问题

agent 正在跑任务，用户中途插入一句话（改需求、加约束、催进度、叫停），系统该怎么接？

## 核心答案

**先定合法插入点**：当前这一批工具调用执行完之后。不要在工具执行中间硬插——状态会乱。工具批次结束、下一轮模型调用之前，是唯一干净的插入点。

**插入消息要标记来源**：外层单独包一层提醒，告诉模型「这是用户在执行过程中插入的信息」，让它能区分原始任务指令和插话，再决定是改目标、加约束，还是放弃当前路径重来。

**长命令场景**：把耗时命令转到后台执行，先响应插话，回头再收结果——不能让一条命令把整个交互阻塞住。

**打断 ≠ 取消**：用户说「停」要真取消（取消信号一路传到执行层，不再发新的调用）；只是「催一下」就继续跑，插话只用来更新状态。

## 深度解析

- **设计要点是消息流驱动**：插话以**新消息**进入对话流，而不是直接改写共享 state——绕过消息流的修改不会被 checkpoint 正确记录（这是 LangGraph 那类状态机实现里最容易踩的雷）。
- **插话要不要触发重规划**：看类型。加约束、改目标要重规划；催进度、补充背景信息通常不用。
- **和审批的区别**：审批是系统等人（流程停住等你点），插话是人插系统（流程还在跑）。两者经常混在一起问，答题要分开。

## 我的理解

（留空，后续自行填写）

## 关联题目

- [LangGraph 的 Interrupt 中断恢复怎么实现](/frameworks/langgraph-interrupt)
- [LangGraph 子图的 Interrupt 如何冒泡](/frameworks/langgraph-subgraph-interrupt-gateway)
- [Human-in-the-Loop 实现](/system-design/human-in-the-loop)
- [场景：语音 Agent 的延迟与打断](/scenarios/voice-agent-latency)
