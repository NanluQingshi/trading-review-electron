# 进入 sqlite 交互
sqlite3 server/data/activation.db

# 常用 SQL
.tables              # 查看所有表
.schema              # 查看表结构
SELECT * FROM activation_codes;   # 查看全部数据
.quit               # 退出