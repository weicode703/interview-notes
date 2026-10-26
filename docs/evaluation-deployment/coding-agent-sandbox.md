---
title: Coding Agent 的沙箱怎么做的？（Claude Code 与 Codex）
category: 评估与部署
tags: [沙箱, Coding Agent, 安全执行, 面试高频]
importance: 2
mastery: 未掌握
source: 自整理
---

## 问题

Claude Code 和 Codex 分别怎么做沙箱隔离？为什么不用简单的命令黑名单？

## 核心答案

**Claude Code：两条线**

- **git 工作树隔离**：原生提供 worktree 参数，代码修改和运行推演都在隔离目录里进行，任务失败直接销毁该目录，主分支毫发无损；
- **交互式防御**：放弃简单的正则过滤，用 Tree-sitter 解析成语法树、精准拆解命令拼接，对未授权的操作弹出人机交互确认。

**Codex：走操作系统原生沙箱**

- **Linux**：依托 bubblewrap，用命名空间切断网络（防私密信息外泄），大部分系统目录以只读方式挂载，再用系统调用过滤（seccomp）挡掉高危指令；
- **macOS**：调用 `sandbox-exec` 加载 seatbelt 安全规则，默认拒绝网络连接和随意读写，文件写入严格限制在工程目录内。

**为什么不用黑名单**：命令能拼接、能别名、能塞进管道和脚本里间接执行（`rm` 换成 `find -delete`、换个 `python -c` 就绕过了），正则拦不全。语法树 + 系统级沙箱是**默认拒绝、显式放行**，比枚举危险命令可靠得多。

## 深度解析

- **沙箱不是越严越好**：切断网络会让装包、查文档、拉依赖全废。所以要有分级（只读 / 工作区可写 / 全权限），按任务需要放开，而不是一刀切。
- **和审批策略配合**：能自动的自动跑，越界的挂起问人——沙箱管「碰不到」，审批管「要不要碰」。
- **验证沙箱是否真生效**：不能只看配置，要实测——试着写工作区外的文件、试着连外网，确认真的被拒，这才叫验证过。

## 我的理解

（留空，后续自行填写）

## 关联题目

- [Agent 的「安全执行」具体指什么](/evaluation-deployment/agent-security-execution)
- [Agent 安全与权限控制](/evaluation-deployment/agent-security)
- [MCP 有哪些安全风险](/evaluation-deployment/mcp-security-risks)
- [Human-in-the-Loop 实现](/system-design/human-in-the-loop)
