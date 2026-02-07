###
 # @Author: NanluQingshi
 # @Date: 2026-02-07 15:53:10
 # @LastEditors: NanluQingshi
 # @LastEditTime: 2026-02-07 16:14:07
 # @Description: 
### 
#!/bin/bash

# 定义颜色，让输出好看点
RED='\033[0;31m'
GREEN='\033[0;32m'
NC='\033[0m' # No Color

echo -e "${GREEN}=== TradingReview 启动修复工具 ===${NC}"
echo ""
echo "检测到您可能遇到了\"文件已损坏\"或\"无法验证开发者\"的提示。"
echo "本工具将移除 macOS 对 TradingReview 的隔离限制。"
echo ""
echo -e "${RED}请注意：接下来需要输入您的【开机密码】以授权修复。${NC}"
echo -e "${RED}输入密码时，屏幕上不会显示任何字符，输完后直接按回车即可。${NC}"
echo ""

# 尝试修复 /Applications 下的应用
APP_PATH="/Applications/TradingReview.app"

if [ -d "$APP_PATH" ]; then
    echo "正在修复安装在“应用程序”文件夹中的应用..."
    # 核心命令：只移除该应用的隔离属性，不影响系统安全
    sudo xattr -cr "$APP_PATH"
    
    # 再次签名（有时候 xattr 不够，重新做个本地签名更稳）
    sudo codesign --force --deep --sign - "$APP_PATH"

    echo ""
    echo -e "${GREEN}✅ 修复成功！您现在可以正常打开 TradingReview 了。${NC}"
else
    echo -e "${RED}❌ 未找到应用！${NC}"
    echo "请确保您已经把 TradingReview 拖入到了【应用程序 (Applications)】文件夹中。"
fi

echo ""
echo "按任意键退出..."
read -n 1 -s