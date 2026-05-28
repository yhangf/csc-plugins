# 6. **关键测试用例**

*定义子系统的关键测试用例，包括单元测试、集成测试、BVT、性能和回归验证。每个用例必须可执行，并能被实施计划直接转化为测试代码或验证命令。禁止只写测试点名称或“验证功能正常”。*

## 6.1. **单元测试用例**

*列出需要单元测试覆盖的关键模块和函数。每个关键业务函数至少覆盖正常、边界、异常三类场景；3-High 函数必须覆盖所有异常分支。*

| 用例编号 | 测试模块 | 测试类/函数 | 类型 | 前置条件/测试数据 | 输入/步骤 | 预期结果/断言 | 自动化目标 |
|---|---|---|---|---|---|---|---|
| UT-001 | Business Logic | ServiceManager.create_service() | 正常 | 有可用配额；服务名 `test-service` | 调用 `create_service(data)` | 返回 service id；name 等于输入；持久化记录存在 | `tests/test_service_manager.py::test_create_service_success` |
| UT-002 | Business Logic | ServiceManager.create_service() | 异常 | 服务名包含非法字符 | 调用 `create_service(data)` | 抛出 ValidationError；不写入数据库 | `tests/test_service_manager.py::test_create_service_invalid_name` |
| UT-003 | Business Logic | ServiceManager.create_service() | 边界 | 配额已满 | 调用 `create_service(data)` | 抛出 QuotaExceededError；返回错误码符合接口定义 | `tests/test_service_manager.py::test_create_service_quota_exceeded` |

**示例测试代码:**

```python
class TestServiceManager(unittest.TestCase):
    def test_create_service_success(self):
        data = {
            'name': 'test-service',
            'config': {'cpu': '1000m', 'memory': '2048Mi'}
        }
        service = ServiceManager.create_service(data)
        self.assertIsNotNone(service.id)
        self.assertEqual(service.name, 'test-service')

    def test_create_service_invalid_name(self):
        data = {'name': 'invalid name!', 'config': {}}
        with self.assertRaises(ValidationError):
            ServiceManager.create_service(data)

    def test_create_service_quota_exceeded(self):
        with patch('QuotaService.check_quota', return_value=False):
            data = {'name': 'test', 'config': {}}
            with self.assertRaises(QuotaExceededError):
                ServiceManager.create_service(data)
```

## 6.2. **集成/API/契约测试用例**

*列出跨模块、API、数据库、外部依赖的关键场景。接口类用例必须关联 OpenAPI path/operationId。*

| 用例编号 | 测试场景 | 类型 | 测试范围 | 前置条件/测试数据 | 测试步骤 | 预期结果/断言 | 自动化目标 |
|---|---|---|---|---|---|---|---|
| IT-001 | 创建服务端到端 | 正常 | API -> 业务逻辑 -> 数据库 | 准备合法创建请求 | 1. 调用创建API<br>2. 查询数据库记录<br>3. 校验响应结构 | 201 响应；数据库有记录；响应符合 OpenAPI schema | API/集成测试 |
| IT-002 | 并发创建服务 | 边界 | API -> 业务逻辑 -> 数据库 | 准备 100 个并发请求 | 并发调用创建接口 | 全部成功或按配额规则正确失败；无重复/脏数据 | 集成测试 |
| IT-003 | 数据库故障恢复 | 异常 | 服务 -> 数据库 | 模拟主库故障 | 1. 触发故障<br>2. 自动切换<br>3. 调用查询接口 | 服务可用；错误处理符合 §5；RTO 达标 | 集成/故障注入 |

## 6.3. **BVT测试用例**

*定义 Build Verification Test 的关键用例，用于判断构建是否具备继续测试的基本条件。*

| 用例编号 | 测试场景 | 前置条件 | 测试步骤 | 通过标准/断言 | 自动化目标 |
|---|---|---|---|---|---|
| BVT-001 | 服务启动 | 构建产物已部署 | 启动服务，检查健康接口 | 返回 200；关键依赖状态正常 | CI smoke test |
| BVT-002 | 数据库连接 | 测试库可访问 | 查询服务列表 | 成功返回列表；无连接错误 | CI smoke test |
| BVT-003 | 创建服务 | 准备合法请求 | 调用创建 API | 返回 201；数据库有记录 | CI smoke test |
| BVT-004 | 删除服务 | 已存在测试服务 | 调用删除 API | 返回 204；数据库无记录 | CI smoke test |

## 6.4. **性能测试用例**

*定义性能测试场景。所有目标值必须来自需求、历史基线或明确标注 `[待验证]`。*

| 用例编号 | 测试场景 | 测试指标 | 测试条件 | 目标值 | 通过标准 | 自动化目标 |
|---|---|---|---|---|---|---|
| PT-001 | 查询服务列表 | 响应时间 | 1000 并发用户 | P95 < 200ms | 连续 10 分钟达标，错误率 < 0.1% | 性能压测 |
| PT-002 | 创建服务 | 吞吐量 | 持续压测 10 分钟 | > 100 TPS | 无数据不一致；错误码符合预期 | 性能压测 |
| PT-003 | 数据库查询 | 查询时间 | 100 万条记录 | < 50ms | 查询计划命中索引 | 性能/SQL 测试 |

## 6.5. **回归测试用例**

*来自 §4 影响分析和 §5 异常处理策略。所有受影响既有能力必须有回归用例；无法自动化时说明原因。*

| 用例编号 | 回归场景 | 关联影响/设计项 | 前置条件/测试数据 | 测试步骤 | 预期结果/断言 | 自动化方式 |
|---|---|---|---|---|---|---|
| RT-001 | *[受影响功能]* | §4.x / §5.x | *[数据准备]* | *[步骤]* | *[断言]* | 单元/集成/API/E2E/手工（说明原因） |
