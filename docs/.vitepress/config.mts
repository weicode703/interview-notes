import { defineConfig } from 'vitepress'

const githubUser = 'saojesus733-gif'
const repo = 'interview-notes'
const base = `/${repo}/`

export default defineConfig({
  lang: 'zh-CN',
  title: '面试八股文知识库',
  description: '计算机面试八股文与面经整理：LLM 应用与 Agent、计算机网络、操作系统、数据库、系统设计、算法',
  base,
  lastUpdated: true,
  cleanUrls: true,

  head: [
    ['link', { rel: 'preconnect', href: 'https://fonts.googleapis.com' }],
    ['link', { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: '' }],
    ['link', { rel: 'stylesheet', href: 'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap' }],
    ['link', { rel: 'icon', type: 'image/svg+xml', href: `${base}favicon.svg` }],
    // 默认浅色主题（用户手动切换后尊重其选择），代码块保持深色
    ['script', {}, "try{if(!localStorage.getItem('vitepress-theme-appearance'))localStorage.setItem('vitepress-theme-appearance','light')}catch(e){}"]
  ],

  markdown: {
    lineNumbers: false,
    theme: 'github-dark'
  },

  themeConfig: {
    nav: [
      { text: '首页', link: '/' },
      {
        text: '计算机基础',
        items: [
          { text: '计算机网络', link: '/network/' },
          { text: '操作系统', link: '/os/' },
          { text: '数据库', link: '/database/' },
          { text: 'Python 栈', link: '/python/' },
          { text: '消息队列', link: '/mq/' },
          { text: '分布式', link: '/distributed/' },
          { text: '线上排查', link: '/troubleshooting/' },
          { text: '编程语言', link: '/language/' },
          { text: '算法', link: '/algorithm/' }
        ]
      },
      {
        text: 'AI 题库',
        items: [
          { text: 'LLM 基础', link: '/llm-basics/' },
          { text: 'Prompt 工程', link: '/prompt-engineering/' },
          { text: 'Agent 架构', link: '/agent-architecture/' },
          { text: '记忆与工具调用', link: '/agent-memory-tools/' },
          { text: 'RAG', link: '/rag/' },
          { text: 'LangChain / LangGraph', link: '/frameworks/' },
          { text: '系统设计与工程实践', link: '/system-design/' },
          { text: '评估、部署与安全', link: '/evaluation-deployment/' },
          { text: '场景实战', link: '/scenarios/' },
          { text: '手写编程题', link: '/coding/' },
          { text: '训练与对齐', link: '/training/' },
          { text: '行为面与项目面', link: '/behavioral/' },
          { text: 'AI 应用（自整理）', link: '/ai/' }
        ]
      },
      { text: '面经', link: '/interview/' },
      { text: '项目准备', link: '/my-prep/' },
      { text: '名词解释', link: '/glossary' },
      { text: '抓面经', link: '/scrape/' },
      { text: '随机刷题', link: '/random' },
      { text: '错题本', link: '/review' },
      { text: '模拟面试', link: '/mock-interview' },
      { text: '统计', link: '/stats' }
    ],

    sidebar: {
      '/network/': [
        {
          text: '计算机网络',
          collapsed: false,
          items: [
            { text: '分类索引', link: '/network/' },
            { text: 'TCP / UDP', link: '/network/tcp-udp' },
            { text: 'HTTP / HTTPS', link: '/network/http-https' },
            { text: 'JWT 主动失效与双 Token', link: '/network/jwt-active-invalidation' },
            { text: 'Nginx 反向代理与负载均衡', link: '/network/nginx-reverse-proxy' }
          ]
        }
      ],
      '/os/': [
        {
          text: '操作系统',
          collapsed: false,
          items: [
            { text: '分类索引', link: '/os/' },
            { text: '进程与线程', link: '/os/process-thread' }
          ]
        }
      ],
      '/database/': [
        {
          text: '数据库',
          collapsed: false,
          items: [
            { text: '分类索引', link: '/database/' },
            { text: 'MySQL 索引', link: '/database/mysql-index' },
            { text: 'Redis 持久化', link: '/database/redis-persistence' }
          ]
        }
      ],
      '/ai/': [
        {
          text: 'AI 应用与 Agent',
          collapsed: false,
          items: [
            { text: '分类索引', link: '/ai/' },
            { text: 'RAG 原理与流程', link: '/ai/rag-pipeline' },
            { text: 'RAG 与微调选型', link: '/ai/rag-vs-finetune' },
            { text: 'Agent 架构与 ReAct', link: '/ai/agent-react' },
            { text: 'Function Calling 流程', link: '/ai/function-calling' },
            { text: 'Agent 记忆机制', link: '/ai/agent-memory' },
            { text: 'LLM 幻觉与缓解', link: '/ai/llm-hallucination' }
          ]
        }
      ],
      '/language/': [
        {
          text: '编程语言（Java）',
          collapsed: false,
          items: [
            { text: '分类索引', link: '/language/' }
          ]
        }
      ],
      '/scenarios/': [
        {
          text: '场景实战',
          collapsed: false,
          items: [
            { text: '分类索引', link: '/scenarios/' },
            { text: 'RAG 问答答非所问的排查', link: '/scenarios/rag-answer-misalignment' },
            { text: 'Agent 死循环与预算失控', link: '/scenarios/agent-infinite-loop' },
            { text: '幻觉引发的业务事故', link: '/scenarios/hallucination-business-incident' },
            { text: '长文档问答的成本优化', link: '/scenarios/long-doc-qa-cost' },
            { text: '知识库更新的时效问题', link: '/scenarios/knowledge-staleness' },
            { text: '多轮对话的意图漂移', link: '/scenarios/multi-turn-context-conflict' },
            { text: '工具参数错误频发治理', link: '/scenarios/tool-param-errors' },
            { text: '慢接口不拖垮执行链路', link: '/scenarios/slow-upstream-api' },
            { text: '字段抽取合格率提升', link: '/scenarios/extraction-quality' },
            { text: 'Prompt 管理工程化改造', link: '/scenarios/prompt-maintenance-chaos' },
            { text: '小模型替换大模型灰度', link: '/scenarios/model-router-rollout' },
            { text: '转账 Agent 上线安全评审', link: '/scenarios/agent-launch-review' },
            { text: 'Text2SQL / ChatBI', link: '/scenarios/text2sql-chatbi' },
            { text: '语音 Agent 延迟与打断', link: '/scenarios/voice-agent-latency' },
            { text: '从零到一搭建智能问答', link: '/scenarios/zero-to-one-agent-platform' },
            { text: '模型 API 下线迁移', link: '/scenarios/model-deprecation-migration' },
            { text: '评估集冷启动', link: '/scenarios/eval-cold-start' },
            { text: '多知识源路由与融合', link: '/scenarios/multi-source-routing' }
          ]
        }
      ],
      '/behavioral/': [
        {
          text: '行为面与项目面',
          collapsed: false,
          items: [
            { text: '分类索引', link: '/behavioral/' },
            { text: '自我介绍怎么做', link: '/behavioral/self-introduction' },
            { text: '为什么转 AI Agent 方向', link: '/behavioral/why-transition-to-ai' },
            { text: '项目介绍与 STAR 深挖', link: '/behavioral/project-star-framework' },
            { text: '最难的技术决策', link: '/behavioral/hardest-technical-decision' },
            { text: '技术分歧与冲突', link: '/behavioral/conflict-disagreement' },
            { text: '学习方法论', link: '/behavioral/learning-method' },
            { text: '没有 AI 项目经验怎么应对', link: '/behavioral/no-real-ai-project' },
            { text: '职业规划怎么讲', link: '/behavioral/career-plan' },
            { text: '反问环节问什么', link: '/behavioral/reverse-questions' },
            { text: 'HR 面与谈薪要点', link: '/behavioral/hr-round-salary' }
          ]
        }
      ],
      '/training/': [
        {
          text: '训练与对齐',
          collapsed: false,
          items: [
            { text: '分类索引', link: '/training/' },
            { text: '预训练/SFT/RLHF 流水线', link: '/training/pretrain-sft-rlhf-pipeline' },
            { text: 'RLHF 原理与奖励模型', link: '/training/rlhf-principle' },
            { text: 'DPO 与 RLHF 对比', link: '/training/dpo-vs-rlhf' },
            { text: 'SFT 数据的准备', link: '/training/sft-data-preparation' },
            { text: '基座模型与指令模型', link: '/training/base-vs-instruct-model' },
            { text: '训练数据清洗与去重', link: '/training/data-cleaning-dedup' }
          ]
        }
      ],
      '/coding/': [
        {
          text: '手写编程题',
          collapsed: false,
          items: [
            { text: '分类索引', link: '/coding/' },
            { text: '手写 RRF 融合函数', link: '/coding/implement-rrf' },
            { text: '手写 Chunking 切分', link: '/coding/implement-chunking' },
            { text: '手写 ReAct 主循环', link: '/coding/implement-react-loop' },
            { text: '手写 Token 裁剪', link: '/coding/implement-context-trim' },
            { text: '手写语义缓存', link: '/coding/implement-semantic-cache' },
            { text: '手写 Scaled Dot-Product Attention', link: '/coding/implement-attention' }
          ]
        }
      ],
      '/mq/': [
        {
          text: '消息队列',
          collapsed: false,
          items: [
            { text: '分类索引', link: '/mq/' },
            { text: '为什么用消息队列及选型', link: '/mq/mq-why-and-selection' },
            { text: 'Kafka 架构与高性能原因', link: '/mq/kafka-architecture' },
            { text: '如何保证消息不丢失', link: '/mq/mq-no-message-loss' },
            { text: '重复消费与幂等处理', link: '/mq/mq-duplicate-idempotence' },
            { text: '如何保证消息顺序', link: '/mq/mq-order' },
            { text: '消息积压怎么处理', link: '/mq/mq-backlog' },
            { text: '消息投递语义', link: '/mq/mq-delivery-semantics' },
            { text: '事务消息与本地消息表', link: '/mq/mq-transaction-message' }
          ]
        }
      ],
      '/distributed/': [
        {
          text: '分布式',
          collapsed: false,
          items: [
            { text: '分类索引', link: '/distributed/' },
            { text: 'CAP 理论与 BASE 理论', link: '/distributed/cap-base' },
            { text: '分布式事务的常见方案', link: '/distributed/distributed-transaction' },
            { text: '分布式 ID 生成方案', link: '/distributed/distributed-id' },
            { text: '限流算法', link: '/distributed/rate-limiting' },
            { text: '熔断、降级与隔离', link: '/distributed/circuit-breaker-degradation' },
            { text: '一致性哈希', link: '/distributed/consistent-hashing' },
            { text: '分布式锁方案对比', link: '/distributed/distributed-lock-compare' },
            { text: '接口幂等性设计', link: '/distributed/idempotency-design' },
            { text: 'Webhook 数据同步可靠性', link: '/distributed/webhook-sync-reliability' },
            { text: '共识算法 Raft/Paxos/ZAB', link: '/distributed/raft-consensus' }
          ]
        }
      ],
      '/troubleshooting/': [
        {
          text: '线上排查',
          collapsed: false,
          items: [
            { text: '分类索引', link: '/troubleshooting/' },
            { text: 'CPU 100% 排查', link: '/troubleshooting/cpu-100-troubleshooting' },
            { text: '内存上涨 / OOM 排查', link: '/troubleshooting/oom-troubleshooting' },
            { text: 'Python GC 与循环引用', link: '/troubleshooting/python-gc-cycles' },
            { text: '接口变慢通用排查思路', link: '/troubleshooting/api-slowdown-checklist' },
            { text: '日志排查常用命令', link: '/troubleshooting/linux-log-commands' }
          ]
        }
      ],
      '/python/': [
        {
          text: 'Python 栈',
          collapsed: false,
          items: [
            { text: '分类索引', link: '/python/' },
            { text: 'GIL 是什么', link: '/python/python-gil' },
            { text: 'asyncio 事件循环', link: '/python/python-asyncio' },
            { text: 'FastAPI 为什么适合 AI 应用', link: '/python/fastapi-core' },
            { text: 'SQLAlchemy 核心概念', link: '/python/sqlalchemy-core-concepts' },
            { text: 'Pydantic 与结构化校验', link: '/python/pydantic-validation' },
            { text: '装饰器与生成器', link: '/python/python-decorators-generators' },
            { text: 'PostgreSQL vs MySQL', link: '/python/postgres-vs-mysql' },
            { text: 'pgvector 向量检索', link: '/python/pgvector-rag' },
            { text: 'Redis 在 LLM 应用里做什么', link: '/python/redis-in-llm-app' },
            { text: 'Docker 部署 AI 应用', link: '/python/docker-deploy-llm' },
            { text: 'DashScope / Qwen 工程化', link: '/python/dashscope-qwen-engineering' }
          ]
        }
      ],
      '/system-design/': [
        {
          text: '系统设计与工程实践',
          collapsed: false,
          items: [
            { text: '分类索引', link: '/system-design/' },
            { text: '企业级 RAG 系统设计', link: '/system-design/enterprise-rag-design' },
            { text: 'Multi-Agent 智能客服', link: '/system-design/multi-agent-support-system' },
            { text: 'Agent 工作流引擎设计', link: '/system-design/agent-workflow-engine' },
            { text: 'LLM Gateway 网关设计', link: '/system-design/llm-gateway' },
            { text: '分布式 Agent 调度系统', link: '/system-design/distributed-agent-scheduling' },
            { text: '流式响应与 SSE', link: '/system-design/streaming-sse' },
            { text: 'Human-in-the-Loop 实现', link: '/system-design/human-in-the-loop' },
            { text: '日均百万级查询架构', link: '/system-design/million-daily-queries' },
            { text: '微服务接入 Agent', link: '/system-design/microservices-agent-integration' },
            { text: 'LLM 推理吞吐量优化', link: '/system-design/inference-throughput' },
            { text: 'Memory 管理系统设计', link: '/system-design/memory-system-design' },
            { text: '流式 RAG 系统设计', link: '/system-design/streaming-rag-design' }
          ]
        }
      ],
      '/llm-basics/': [
        {
          text: 'LLM 基础',
          collapsed: false,
          items: [
            { text: '分类索引', link: '/llm-basics/' },
            { text: 'Transformer 架构', link: '/llm-basics/transformer-architecture' },
            { text: 'Attention 机制', link: '/llm-basics/attention-mechanism' },
            { text: 'Token 与分词', link: '/llm-basics/tokenization' },
            { text: 'KV Cache', link: '/llm-basics/kv-cache' },
            { text: '上下文窗口与长上下文', link: '/llm-basics/context-window-long-context' },
            { text: '解码策略', link: '/llm-basics/decoding-strategies' },
            { text: '位置编码 RoPE / ALiBi', link: '/llm-basics/positional-encoding-rope-alibi' },
            { text: 'LLM 幻觉的原理', link: '/llm-basics/hallucination-principle' },
            { text: 'LLM 三大知识缺陷', link: '/llm-basics/llm-knowledge-defects' },
            { text: '开源 vs 闭源模型选型', link: '/llm-basics/open-vs-closed-source-models' },
            { text: 'MoE 混合专家架构', link: '/llm-basics/moe-architecture' },
            { text: 'LoRA / PEFT 高效微调', link: '/llm-basics/peft-lora' },
            { text: 'LN vs BN 与多头的作用', link: '/llm-basics/layer-norm-vs-batch-norm' },
            { text: 'RoPE 的优势与外推极限', link: '/llm-basics/rope-extrapolation-limits' },
            { text: '中文分词的坑', link: '/llm-basics/chinese-tokenization-pitfalls' },
            { text: 'GPT/Claude/Qwen/DeepSeek 选型', link: '/llm-basics/llm-model-landscape' },
            { text: 'RULER 与有效上下文', link: '/llm-basics/ruler-long-context' }
          ]
        }
      ],
      '/prompt-engineering/': [
        {
          text: 'Prompt 工程与上下文工程',
          collapsed: false,
          items: [
            { text: '分类索引', link: '/prompt-engineering/' },
            { text: 'Prompt 设计原则', link: '/prompt-engineering/prompt-design-principles' },
            { text: '结构化输出', link: '/prompt-engineering/structured-output' },
            { text: 'LLM 抽取的确定性校验', link: '/prompt-engineering/llm-extraction-deterministic-validation' },
            { text: 'CoT 与 ReAct 的 Prompt 实现', link: '/prompt-engineering/cot-react-prompting' },
            { text: 'System Prompt 设计', link: '/prompt-engineering/system-prompt-design' },
            { text: 'Few-shot 策略', link: '/prompt-engineering/few-shot-strategies' },
            { text: 'Prompt 注入攻击与防御', link: '/prompt-engineering/prompt-injection-defense' },
            { text: 'Token Budget 分配', link: '/prompt-engineering/token-budget-allocation' },
            { text: '上下文压缩与滚动摘要', link: '/prompt-engineering/context-compression-rolling-summary' },
            { text: 'Context Engineering 核心思路', link: '/prompt-engineering/context-engineering-core' },
            { text: 'Prompt 反模式与调优', link: '/prompt-engineering/prompt-anti-patterns' },
            { text: 'Prompt Engineering 的本质', link: '/prompt-engineering/prompt-engineering-essence' },
            { text: '自动化 Prompt 优化', link: '/prompt-engineering/automated-prompt-optimization' }
          ]
        }
      ],
      '/agent-architecture/': [
        {
          text: 'Agent 架构与核心机制',
          collapsed: false,
          items: [
            { text: '分类索引', link: '/agent-architecture/' },
            { text: 'Agent 定义与四组件模型', link: '/agent-architecture/agent-four-components' },
            { text: 'ReAct 核心思想与 TAO 循环', link: '/agent-architecture/react-framework-core-idea' },
            { text: 'Plan-and-Execute vs ReAct', link: '/agent-architecture/plan-and-execute-vs-react' },
            { text: 'Tree of Thoughts 适用场景', link: '/agent-architecture/tree-of-thoughts-scenarios' },
            { text: 'Workflow 与 Agent 的边界', link: '/agent-architecture/workflow-vs-agent-boundary' },
            { text: '规划器设计与路径震荡', link: '/agent-architecture/agent-planner-design' },
            { text: '执行循环与状态化设计', link: '/agent-architecture/agent-execution-loop-state' },
            { text: '单入口多子图编排', link: '/agent-architecture/multi-subgraph-orchestration' },
            { text: '控制流与数据流解耦', link: '/agent-architecture/control-flow-data-flow-decoupling' },
            { text: 'Multi-Agent 协作模式', link: '/agent-architecture/multi-agent-collaboration-patterns' },
            { text: '渐进式披露', link: '/agent-architecture/progressive-disclosure' },
            { text: 'Reflexion 自我纠错', link: '/agent-architecture/reflexion-self-correction' },
            { text: 'Orchestrator-Workers 模式', link: '/agent-architecture/orchestrator-workers' },
            { text: 'Loop of Death 死循环防线', link: '/agent-architecture/loop-of-death' }
          ]
        }
      ],
      '/agent-memory-tools/': [
        {
          text: 'Agent 记忆与工具调用',
          collapsed: false,
          items: [
            { text: '分类索引', link: '/agent-memory-tools/' },
            { text: '短期与长期记忆设计', link: '/agent-memory-tools/working-vs-long-term-memory' },
            { text: '记忆的存储方案', link: '/agent-memory-tools/memory-storage-solutions' },
            { text: '多轮对话完整链路', link: '/agent-memory-tools/multi-turn-pipeline' },
            { text: '对话记忆持久化', link: '/agent-memory-tools/memory-persistence' },
            { text: 'Chat Memory vs Chat History', link: '/agent-memory-tools/chat-memory-vs-chat-history' },
            { text: 'Token 超限裁剪策略', link: '/agent-memory-tools/context-trimming' },
            { text: 'RAG 会话记忆设计', link: '/agent-memory-tools/rag-session-memory-design' },
            { text: 'Tool Calling 机制', link: '/agent-memory-tools/tool-calling-mechanism' },
            { text: '工具设计原则与 MCP', link: '/agent-memory-tools/tool-design-principles-mcp' },
            { text: 'Skill / MCP / Rule 区别', link: '/agent-memory-tools/skill-mcp-rule' },
            { text: 'Agent 与外部 API 集成', link: '/agent-memory-tools/agent-api-integration' },
            { text: '长期记忆框架 Mem0 / Zep', link: '/agent-memory-tools/long-term-memory-frameworks' }
          ]
        }
      ],
      '/rag/': [
        {
          text: 'RAG 检索增强生成',
          collapsed: false,
          items: [
            { text: '分类索引', link: '/rag/' },
            { text: 'RAG 定义与核心价值', link: '/rag/rag-definition-value' },
            { text: 'RAG 与微调本质区别', link: '/rag/rag-vs-finetune' },
            { text: 'Chunk 切分策略', link: '/rag/chunking-strategies' },
            { text: 'Embedding 模型选型', link: '/rag/embedding-selection' },
            { text: '向量检索原理', link: '/rag/vector-search-principle' },
            { text: '自建检索 vs 向量数据库', link: '/rag/self-built-retrieval-vs-vector-db' },
            { text: '混合检索 BM25+向量+RRF', link: '/rag/hybrid-retrieval-bm25-rrf' },
            { text: 'Rerank 与 Bi/Cross-Encoder', link: '/rag/rerank-bi-cross-encoder' },
            { text: 'RAG 幻觉处理', link: '/rag/rag-hallucination' },
            { text: 'RAG 评估指标', link: '/rag/rag-evaluation-metrics' },
            { text: 'Agentic RAG', link: '/rag/agentic-rag' },
            { text: 'GraphRAG', link: '/rag/graph-rag' },
            { text: '多模态 RAG', link: '/rag/multimodal-rag' },
            { text: 'Lost in the Middle', link: '/rag/lost-in-the-middle' },
            { text: 'RAGAS 评估框架', link: '/rag/ragas-framework' },
            { text: 'RAG 多级模型降级', link: '/rag/llm-multi-level-degradation' }
          ]
        }
      ],
      '/frameworks/': [
        {
          text: 'LangChain / LangGraph',
          collapsed: false,
          items: [
            { text: '分类索引', link: '/frameworks/' },
            { text: 'LangChain 核心组件', link: '/frameworks/langchain-core-components' },
            { text: 'LCEL 表达式', link: '/frameworks/lcel' },
            { text: 'StateGraph 三要素', link: '/frameworks/langgraph-stategraph' },
            { text: 'LangGraph vs LangChain', link: '/frameworks/langgraph-vs-langchain' },
            { text: '条件分支与 Fan-out/Fan-in', link: '/frameworks/conditional-branch-fanout' },
            { text: 'Streaming API 与实时通信', link: '/frameworks/langgraph-streaming' },
            { text: 'Callback 与 Stream 区别', link: '/frameworks/callback-vs-stream' },
            { text: 'Agent 演进为状态机', link: '/frameworks/agent-state-machine-evolution' },
            { text: 'Spring AI 优势', link: '/frameworks/spring-ai' },
            { text: '框架选型对比', link: '/frameworks/framework-selection' },
            { text: 'LangGraph Interrupt 中断恢复', link: '/frameworks/langgraph-interrupt' },
            { text: '子图 Interrupt 与主图网关', link: '/frameworks/langgraph-subgraph-interrupt-gateway' },
            { text: 'LangSmith 定位推理失败', link: '/frameworks/langsmith-observability' },
            { text: 'CrewAI / AutoGen / Agents SDK 选型', link: '/frameworks/agent-framework-comparison' }
          ]
        }
      ],
      '/evaluation-deployment/': [
        {
          text: '评估、部署与安全',
          collapsed: false,
          items: [
            { text: '分类索引', link: '/evaluation-deployment/' },
            { text: 'LLM 应用评估体系', link: '/evaluation-deployment/evaluation-system' },
            { text: 'LLM-as-a-Judge 原理与偏差', link: '/evaluation-deployment/llm-as-a-judge' },
            { text: '评估者分歧处理', link: '/evaluation-deployment/evaluator-disagreement' },
            { text: 'Context Precision / Recall', link: '/evaluation-deployment/context-precision-recall' },
            { text: '流式处理与稳定性', link: '/evaluation-deployment/streaming-stability' },
            { text: 'SSE 事件协议与缓冲排查', link: '/evaluation-deployment/sse-event-protocol-design' },
            { text: '量化与边缘部署', link: '/evaluation-deployment/quantization-edge-deployment' },
            { text: '推理性能优化（模型层）', link: '/evaluation-deployment/inference-optimization' },
            { text: '监控与质量退化检测', link: '/evaluation-deployment/monitoring-quality-drift' },
            { text: '成本控制', link: '/evaluation-deployment/cost-optimization' },
            { text: 'Agent 安全与权限控制', link: '/evaluation-deployment/agent-security' },
            { text: 'Agent 系统的评估方法', link: '/evaluation-deployment/agent-evaluation' },
            { text: '灰度与 A/B 发布', link: '/evaluation-deployment/grayscale-ab-release' },
            { text: 'vLLM PagedAttention 原理', link: '/evaluation-deployment/vllm-paged-attention' },
            { text: '可观测性与 tracing 体系', link: '/evaluation-deployment/observability-tracing' }
          ]
        }
      ],
      '/algorithm/': [
        {
          text: '算法与数据结构',
          collapsed: false,
          items: [
            { text: '分类索引', link: '/algorithm/' }
          ]
        }
      ],
      '/interview/': [
        {
          text: '真实面经',
          collapsed: false,
          items: [
            { text: '面经索引', link: '/interview/' },
            { text: '字节跳动一面（2026-01）', link: '/interview/bytedance-2026-01' }
          ]
        }
      ]
    },

    search: {
      provider: 'local',
      options: {
        translations: {
          button: { buttonText: '搜索文档', buttonAriaLabel: '搜索文档' },
          modal: {
            noResultsText: '未找到相关结果',
            resetButtonTitle: '清除查询条件',
            displayDetails: '显示详细列表',
            footer: { selectText: '选择', navigateText: '切换', closeText: '关闭' }
          }
        }
      }
    },

    outline: { level: [2, 3], label: '本页目录' },

    lastUpdated: {
      text: '最后更新于',
      formatOptions: {
        dateStyle: 'short',
        timeStyle: 'medium'
      }
    },

    editLink: {
      pattern: `https://github.com/${githubUser}/${repo}/edit/main/docs/:path`,
      text: '在 GitHub 上编辑此页'
    },

    socialLinks: [
      { icon: 'github', link: `https://github.com/${githubUser}` }
    ],

    footer: {
      message: '仅供个人学习复习使用',
      copyright: `Copyright © 2026 ${githubUser}`
    },

    docFooter: { prev: '上一篇', next: '下一篇' },
    returnToTopLabel: '回到顶部',
    sidebarMenuLabel: '菜单',
    darkModeSwitchLabel: '主题',
    lightModeSwitchTitle: '切换到浅色模式',
    darkModeSwitchTitle: '切换到深色模式'
  }
})
