---
title: JWT 怎么主动失效？登出、改密与双 Token 设计
category: 计算机网络
tags: [JWT, 认证, Redis, 面试高频]
importance: 3
mastery: 未掌握
source: AI生成
---

## 问题

JWT 是无状态的——签发后服务端不存任何东西，验签即通过。那用户点"退出登录"、账号改密码、Token 泄露了怎么办？
黑名单怎么设计才不会越积越大？Refresh Token 是干嘛的？（简历项目：AIWear 的 JWT＋Redis Token 黑名单）

## 核心答案

- **问题本质**：JWT 把"状态"放在客户端，天然无法主动作废——这是设计上的取舍（换来无水平扩展依赖），不是 bug；需要主动失效就得把一部分状态请回服务端。

- **黑名单方案（登出/单设备下线）**：登出时把该 Token 的唯一标识（`jti` 声明）写入 Redis 黑名单，TTL 设成 Token 的**剩余有效期**——到期自动清理，黑名单永远只存"还活着的已作废 Token"，不会无限膨胀；每次请求验签通过后再查一次黑名单（一次 Redis GET，成本可忽略）。

- **改密/全局下线**：按**用户维度**存一个"凭证版本号"，改密时版本 +1；Token 里带上签发时的版本，版本对不上即失效——一条记录管一个用户的所有 Token。

- **双 Token 设计（无感续期）**：Access Token 短命（如 30 分钟，泄露窗口小），Refresh Token 长命（如 7 天）只用来换新 Access；Access 过期后拿 Refresh 换发，用户无感知。Refresh Token 本身要可撤销（存库/Redis），登出时一并作废。

## 深度解析

- 追问点：为什么不直接把 Access Token 设长一点省掉 Refresh？——长 Token 泄露窗口大且无法挽回；短 Token + 可撤销的 Refresh 兼顾了安全与体验，这是行业主流（OAuth2 同思路）。

- 追问点：黑名单和版本号怎么选？——黑名单管"单个 Token 作废"（精确到某次登录的某个设备），版本号管"某用户全部作废"（改密场景），两者经常配合使用。

- 追问点：验证顺序？——先验签名（不合法直接拒，不碰 Redis），再查黑名单/版本——把贵的检查放后面。

- 常见误区：想给 JWT"续期"（更新过期时间重发）——等于同一凭证无限续命，泄露后永远有效；正确姿势是换发新 Token 时作废旧 Access。

## 我的理解

## 关联题目

- [Cookie、Session、Token（JWT）的区别](/network/cookie-session-jwt)

- [用 Redis 在 Python 服务里做什么？](/python/redis-in-llm-app)

- [Web 安全：XSS 与 CSRF](/network/web-security-xss-csrf)
