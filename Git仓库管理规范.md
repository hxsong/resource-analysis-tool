# Git 使用规范

    ## 分支命名规范

    - 使用小写字母，单词之间用连字符（`-`）分隔。
      - 示例：`feature/login-api`、`bugfix/header-styling`
    - 采用前缀标识分支类型：
      - `feature/`：新功能开发
      - `bugfix/`：问题修复
      - `hotfix/`：紧急修复
      - `release/`：发布准备
      - `chore/`：日常维护
    - 可在分支名称中包含任务编号，以便追踪。
      - 示例：`feature/123-login-api`

    ## 提交信息规范

    - 遵循 [Conventional Commits](https://www.conventionalcommits.org/en/v1.0.0/) 规范：
      - 格式：`<type>(<scope>): <description>`
      - 常用类型：
        - `feat`：新功能
        - `fix`：修复问题
        - `docs`：文档更新
        - `style`：代码格式（不影响功能）
        - `refactor`：重构（非修复或新增功能）
        - `test`：添加或修改测试
        - `chore`：构建过程或辅助工具的变动
      - 示例：`feat(auth): add login endpoint`
    - 使用祈使语气，首字母小写，结尾不加句号。
      - 示例：`fix(api): handle null response`
    - 提交说明应简洁明了：
      - 首行不超过 50 个字符，正文每行不超过 72 个字符。
    - 在正文中详细说明更改动机和背景，可引用相关 issue：
      
      ```markdown
      fix(auth): handle null response

      Ensure the login endpoint returns a 401 status code when the user credentials are invalid.

      Related issue: #123

## 合并策略

*   所有代码合并应通过 Pull Request（PR）进行，需经过代码审查。
*   主分支（如 `main` 或 `master`）始终保持可部署状态。
*   合并前建议使用 `git rebase`，保持提交历史整洁。
*   使用 "Squash and merge" 合并策略，避免无效提交污染历史。

## 协作流程

*   每个功能或修复应在独立分支上开发，避免直接改动主分支。
*   定期同步主分支，减少合并冲突。
*   提交前请确保：
    *   本地测试全部通过；
    *   遵循项目代码规范；
    *   代码已通过审查。
*   使用代码审查流程（如 GitHub PR）确保团队协作质量。

## 自动化与工具

*   使用 CI/CD 工具（如 GitHub Actions、GitLab CI）自动化测试和部署。
*   使用 Prettier 和 ESLint 保持代码格式统一和质量。
*   使用 Husky 配置 Git 钩子：
    *   自动执行代码检查、格式化和测试。
*   使用语义化版本控制（Semantic Versioning）自动管理版本号。

作者：围巾哥萧尘
链接：https://juejin.cn/post/7524923198736121890
来源：稀土掘金
著作权归作者所有。商业转载请联系作者获得授权，非商业转载请注明出处。