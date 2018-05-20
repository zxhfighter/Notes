# 单元测试

- 单元测试依赖 `unittest` 框架。
- 测试类需要继承 `unittest.TestCase`

```py
import unittest
class MyTestCase(unittest.TestCase):
    pass
```

- 测试用例方法名称需要以 `test` 开头，并且没有参数，如果用例方法没有抛出异常，测试通过，否则测试失败

```py
def test_to_roman_known_values(self):
    pass
```

- `TestCase` 类提供了 `assertEqual()` 方法来判断两个值是否相等，不相等抛出异常，测试通过，否则测试失败

```py
self.assertEqual(numeral, result)
```

- 调用 `unittest.main()` 会运行每个测试方法（即定义在继承 TestCase 类中以 `test` 开头的方法）

```py
if __name__ == '__main__':
    unittest.main()
```

- Failure 指调用比较方法（例如 assertEqual 和 assertRaises）比较值不相等的错误，Error 指方法中的其他异常
