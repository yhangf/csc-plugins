# 3. **对外接口**

*描述本子系统对外提供的接口，详细的API定义参见openapi.yaml*

<span style="color:orange">**[AI可读性要求] 本章节只列出接口清单，不重复定义API细节。使用标准格式引用OpenAPI定义：`openapi.yaml#/paths/~1api~1v1~1resources/post`（路径中的斜杠需转义为~1）**</span>

## 3.1. **API接口清单**

*列出本子系统提供的所有API接口*

| 接口名称 | 接口路径 | 方法 | 功能说明 | 所属仓库 | OpenAPI定义位置 |
|---|---|---|---|---|---|
| 查询资源列表 | /api/v1/resources | GET | 查询ResourceA列表 | *repo-service-a* | openapi.yaml#/paths/~1api~1v1~1resources/get |
| 创建资源 | /api/v1/resources | POST | 创建新ResourceA | *repo-service-a* | openapi.yaml#/paths/~1api~1v1~1resources/post |
| 查询资源详情 | /api/v1/resources/{id} | GET | 根据ID查询ResourceA | *repo-service-a* | openapi.yaml#/paths/~1api~1v1~1resources~1{id}/get |
| 更新资源 | /api/v1/resources/{id} | PUT | 更新ResourceA配置 | *repo-service-a* | openapi.yaml#/paths/~1api~1v1~1resources~1{id}/put |
| 删除资源 | /api/v1/resources/{id} | DELETE | 删除ResourceA | *repo-service-a* | openapi.yaml#/paths/~1api~1v1~1resources~1{id}/delete |

*详细的接口定义（参数、响应、错误码等）请参见《openapi.yaml》*

## 3.2. **消息接口**

*如果本子系统发布或订阅消息，列出相关的消息接口*

| 消息类型 | 消息主题/队列 | 方向 | 功能说明 | Schema定义位置 |
|---|---|---|---|---|
| resource.created | resource.events | 发布 | 资源创建成功事件 | openapi.yaml#/components/schemas/ResourceCreatedEvent |
| resource.deleted | resource.events | 发布 | 资源删除完成事件 | openapi.yaml#/components/schemas/ResourceDeletedEvent |

*详细的消息格式定义请参见《openapi.yaml》*

## 3.3. **RPC接口**

*如果本子系统提供RPC接口，列出相关接口*

| 接口名称 | 方法 | 功能说明 | 定义位置 |
|---|---|---|---|
| *内部RPC调用示例* | *queryData* | *内部数据查询* | *内部proto文件或接口文档* |

*如果RPC接口也在openapi.yaml中定义，引用对应位置*

## 3.4. **对外提供的库/SDK**

*如果本子系统提供客户端库或SDK，说明其使用方式*

| 库名称 | 编程语言 | 主要功能 | 使用文档 |
|---|---|---|---|
| service-client-python | Python | 服务调用客户端 | README.md |

## 3.5. **依赖的外部接口（消费接口）**

*本子系统在实现自身功能时，需要调用的其他子系统或外部服务的接口。*

<span style="color:orange">**[AI可读性要求] 此章节定义了本子系统的依赖边界。凡是本子系统代码中会发起的外部调用，必须在此列出——包括调用其他微服务的REST/RPC接口、订阅的消息、调用的第三方服务。每条记录必须写明接口的权威定义来源（使用openapi.yaml引用格式）。**</span>

### 3.5.1. **依赖的 REST/RPC 接口**

| 编号 | 接口名称 | 提供方子系统 | 方法 + 路径 | 调用时机 | 接口定义来源 |
|---|---|---|---|---|---|
| DEP-001 | *认证Token校验* | *认证子系统* | `POST /api/v1/auth/verify` | *每次处理请求时校验token* | *openapi.yaml#/paths/~1api~1v1~1auth~1verify/post* |
| DEP-002 | *查询用户配额* | *配额子系统* | `GET /api/v1/quota/{userId}` | *创建资源前检查配额* | *openapi.yaml#/paths/~1api~1v1~1quota~1{userId}/get* |

*如果接口定义在外部系统（无本地openapi.yaml），填写接口文档链接或描述。*

### 3.5.2. **依赖的消息/事件（订阅）**

*本子系统订阅的消息队列事件*

| 编号 | 事件名称 | 来源子系统 | Topic/Queue | 触发场景 | 消息格式定义来源 |
|---|---|---|---|---|---|
| DEP-E01 | *部署完成事件* | *部署子系统* | `deploy.events` | *订阅部署结果，更新服务状态* | *openapi.yaml#/components/schemas/DeployCompletedEvent* |

### 3.5.3. **依赖接口的异常处理策略**

*当依赖的外部接口不可用时，本子系统的降级处理策略。*

| 依赖编号 | 依赖接口 | 不可用时的影响 | 降级/容错策略 |
|---|---|---|---|
| DEP-001 | 认证Token校验 | 所有请求无法处理 | 返回503，不降级（安全强依赖） |
| DEP-002 | 查询用户配额 | 无法校验配额 | 使用缓存中最近一次配额值，缓存超时后阻断请求 |

