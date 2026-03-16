# 进入 sqlite 交互
sqlite3 server/data/activation.db

# 常用 SQL
.tables              # 查看所有表
.schema              # 查看表结构
SELECT * FROM activation_codes;   # 查看全部数据

# 表结构说明：id(主键), code(激活码), used(是否已用), used_at(使用时间), used_ip(激活IP), created_at(创建时间)
SELECT id, code, used, used_at, used_ip FROM activation_codes;   # 查看含编号和IP

.quit               # 退出