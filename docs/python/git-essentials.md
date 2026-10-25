---
title: Git 高频：merge vs rebase、reset 三模式与救命操作
category: Python 栈
tags: [Git, 版本控制, 协作, 面试高频]
importance: 2
mastery: 未掌握
source: AI生成
---

## 问题

三个区（工作区/暂存区/仓库）是怎么回事？merge 和 rebase 怎么选？
reset 的 soft/mixed/hard 三种模式删掉什么？误提交了敏感信息或者 hard 掉了没提交的代码怎么救？（简历场景：两个项目的多分支开发与 GitHub Actions CI 触发）

## 核心答案

- **三个区**：工作区（编辑中的文件）→ `git add` → 暂存区（下次提交的快照）→ `git commit` → 本地仓库 → `git push` → 远程仓库。add 是"选定要提交什么"，commit 才生成版本。

- **merge vs rebase**：
  - `merge`：把目标分支的提交合并过来，**保留双方原始历史**，产生一个合并提交——历史真实但图会分叉；
  - `rebase`：把当前分支的提交"搬到"目标分支之后重放，历史变成一条直线——整洁但**改写了提交**。
  - 团队铁律：**已推送到共享分支的提交不要 rebase**（别人基于旧提交的工作会错乱）；个人分支同步主干时 rebase 最舒服。

- **reset 三模式**：`--soft` 只动 HEAD（提交撤销、改动回到暂存区，适合重新提交）；`--mixed`（默认）再清空暂存区（改动回到工作区）；`--hard` 连工作区一起清空（**未提交的改动会真没了**，慎用）。

- **两个救命操作**：
  - 提交历史回不去 → `git reflog`：记录 HEAD 的每次移动（包括被 reset 掉的），找到对应 hash 再 `git reset --hard <hash>` 找回；
  - 已推送的坏提交要撤销 → 用 `git revert <hash>` 生成一个反向提交，而不是 reset（改写已推送的历史会让协作者爆炸）。

## 深度解析

- 追问点：revert 和 reset 的本质区别？——reset 是"假装没发生过"（改历史），revert 是"再发生一次抵消"（追加历史）；公共分支只能 revert。

- 追问点：冲突怎么解？——Git 在冲突文件里标 `<<<<<<< / ======= / >>>>>>>` 三段，手动改成想要的结果后 `git add` 标记已解决再提交/rebase --continue；冲突本身不是错误，是 Git 不知道该听谁的。

- 追问点：`git stash` 干嘛的？——临时存起未提交的改动（工作区变干净），切完分支 `git stash pop` 取回来；适合"手头改到一半突然要切分支修 bug"。

- 追问点：分支模型了解吗？——简单协作用 GitHub Flow（main 保持可发布 + 功能分支 + PR 评审合并），CI 挂在 PR 上跑测试，绿了才允许合并——你项目里的 GitHub Actions 就是干这个的。

## 我的理解

## 关联题目

- [Docker 核心八股](/python/docker-fundamentals)

- [FastAPI 为什么适合做 AI 应用服务](/python/fastapi-core)
