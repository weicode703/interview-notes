# Agent 架构与核心机制

本分类收录 Agent 定义、ReAct / Plan-and-Execute / ToT、Workflow 边界、规划器设计、执行循环、控制流解耦、Multi-Agent 协作与渐进式披露相关面试题。

## 题目列表

| 题目 | 重要程度 | 标签 |
| --- | --- | --- |
| [Agent 的定义与四组件模型](/agent-architecture/agent-four-components) | ⭐⭐⭐ | Agent, LLM, 面试高频 |
| [ReAct 框架核心思想与 TAO 循环](/agent-architecture/react-framework-core-idea) | ⭐⭐⭐ | ReAct, Agent, 面试高频 |
| [Plan-and-Execute 与 ReAct 的选型对比](/agent-architecture/plan-and-execute-vs-react) | ⭐⭐⭐ | Plan-and-Execute, ReAct, Agent, 规划 |
| [Tree of Thoughts 的适用场景](/agent-architecture/tree-of-thoughts-scenarios) | ⭐⭐ | Tree of Thoughts, CoT, 推理, Agent |
| [Workflow 与 Agent 的边界](/agent-architecture/workflow-vs-agent-boundary) | ⭐⭐⭐ | Workflow, Agent, 架构选型, 面试高频 |
| [Agent 规划器设计与路径震荡](/agent-architecture/agent-planner-design) | ⭐⭐ | 规划, Agent, 架构设计 |
| [Agent 执行循环与状态化设计](/agent-architecture/agent-execution-loop-state) | ⭐⭐ | Agent, 状态机, 架构设计 |
| [单入口多子图：Agent 怎么按业务拆子图](/agent-architecture/multi-subgraph-orchestration) | ⭐⭐ | LangGraph, 子图, 状态机, 架构设计 |
| [控制流与数据流的解耦](/agent-architecture/control-flow-data-flow-decoupling) | ⭐⭐ | 控制流, 数据流, 架构设计, LangGraph |
| [Multi-Agent 协作模式](/agent-architecture/multi-agent-collaboration-patterns) | ⭐⭐⭐ | Multi-Agent, Agent, 架构设计, 面试高频 |
| [渐进式披露](/agent-architecture/progressive-disclosure) | ⭐ | 渐进式披露, 上下文工程, Agent |
| [Reflexion 自我纠错](/agent-architecture/reflexion-self-correction) | ⭐⭐ | Reflexion, 反思, Agent, 自我纠错 |
| [Orchestrator-Workers 模式](/agent-architecture/orchestrator-workers) | ⭐⭐ | Multi-Agent, Orchestrator, 架构设计, LangGraph |
| [Loop of Death 与死循环防线](/agent-architecture/loop-of-death) | ⭐⭐ | Agent, 死循环, 稳定性, 面试高频 |
| [Checkpoint 机制：存什么、怎么实现、哪些回滚不了](/agent-architecture/checkpoint-mechanism) | ⭐⭐⭐ | Checkpoint, 断点恢复, Agent Runtime, 面试高频 |
| [多 Agent 怎么拆、上下文怎么交接](/agent-architecture/subagent-context-handoff) | ⭐⭐⭐ | Multi-Agent, 上下文交接, 任务拆分, Agent 架构 |
| [子 Agent 结论冲突怎么裁决](/agent-architecture/multi-agent-result-conflict) | ⭐⭐ | Multi-Agent, 一致性, 决策, Agent 架构 |
| [Agent 的幻觉和 LLM 的幻觉有什么不同](/agent-architecture/agent-hallucination) | ⭐⭐⭐ | 幻觉, Agent, 上下文压缩, 记忆 |
| [Agent 执行中用户插话怎么处理](/agent-architecture/mid-turn-user-input) | ⭐⭐ | HITL, 交互设计, Agent Runtime |
| [「一切皆插件」的 Agent Runtime](/agent-architecture/plugin-architecture-cordis) | ⭐⭐ | Agent Runtime, Harness, 插件化, 架构设计 |
