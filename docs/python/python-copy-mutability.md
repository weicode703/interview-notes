---
title: 赋值、浅拷贝、深拷贝与默认参数陷阱
category: Python 栈
tags: [Python, 可变类型, 拷贝, 面试高频]
importance: 2
mastery: 未掌握
source: AI生成
---

## 问题

`b = a` 之后改 b，a 为什么跟着变？`list()` / `copy()` / `deepcopy()` 拷出来的到底差在哪？
函数默认参数 `def f(x, cache=[])` 为什么会"记住"上次调用的数据？

## 核心答案

- **先分清可变/不可变**：不可变（int/str/tuple）改值即换对象；可变（list/dict/set）原地修改不换对象。`b = a` 只是**多贴一个标签**到同一对象，没有拷贝。

- **三层拷贝**：
  - `b = a`：零拷贝，同一对象，改谁都一样（`is` 为 True）；
  - `b = a.copy()` / `list(a)`：**浅拷贝**——外层容器新建，**里面的元素还是引用原对象**；嵌套列表 `a[0].append()` 依然会互相影响；
  - `b = copy.deepcopy(a)`：递归复制全部层级，彻底独立（代价是性能和循环引用要处理）。

- **默认参数陷阱的根源**：默认值在**函数定义时求值一次**并挂在函数对象上，之后所有调用共享同一个默认对象——可变默认参数（`cache=[]`）于是成了跨调用的"全局"存储。修法：默认 `None`，函数体内 `cache = cache if cache is not None else []`。

## 深度解析

- 追问点：怎么快速验证拷贝层级？——`id(a) == id(b)`（同对象）、`id(a[0]) == id(b[0])`（子元素是否共享）两步看清楚。

- 追问点：tuple 一定不可变吗？——tuple 本身不可变，但它**可以装可变对象**：`t = ([1],)` 里 `t[0].append(2)` 合法——"不可变"约束的是元组结构不是内含对象。

- 追问点：这坑在真实项目里长什么样？——一个隐蔽版本：类属性当默认配置 `class C: items = []`，所有实例共享同一个列表；和默认参数陷阱同根：**可变对象被当成了"定义期常量"**。

- 常见误区：以为 `b = a[:]`（切片）是深拷贝——切片只复制第一层，本质还是浅拷贝。

## 我的理解

## 关联题目

- [装饰器与生成器的原理和使用场景](/python/python-decorators-generators)

- [Pydantic 与 LLM 输出的结构化校验](/python/pydantic-validation)

- [Python GC 与循环引用](/troubleshooting/python-gc-cycles)
