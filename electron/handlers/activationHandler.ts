/*
 * @Author: NanluQingshi
 * @Date: 2026-03-14 19:24:08
 * @LastEditors: NanluQingshi
 * @LastEditTime: 2026-03-15 22:20:58
 * @Description: 
 */
/*
 * @Author: NanluQingshi
 * @Description: 激活码验证逻辑 - 联网验证，一次生效
 */
import { app } from "electron";
import {
  getActivationStatus,
  setActivation,
  getActivationServerUrl as getConfigServerUrl,
} from "@electron/config";

// 激活接口路径，写在代码中
const ACTIVATION_API_PATH = "/api/activate";

// 激活服务器 base URL，优先级：环境变量 > config.json > 默认值（不含接口路径）
const getActivationServerUrl = (): string => {
  const base =
    process.env.ACTIVATION_SERVER_URL ||
    getConfigServerUrl() ||
    "https://your-activation-server.com";
  // 若已包含完整路径则直接用，否则拼接（兼容旧配置）
  return base.endsWith(ACTIVATION_API_PATH)
    ? base
    : base.replace(/\/$/, "") + ACTIVATION_API_PATH;
};

export const isActivated = (): boolean => {
  return getActivationStatus();
};

export interface VerifyResult {
  success: boolean;
  message: string;
}

export const verifyActivationCode = async (code: string): Promise<VerifyResult> => {
  const trimmedCode = code?.trim();
  if (!trimmedCode) {
    return { success: false, message: "请输入激活码" };
  }

  try {
    const serverUrl = getActivationServerUrl();
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
    };
    const response = await fetch(serverUrl, {
      method: "POST",
      headers,
      body: JSON.stringify({
        code: trimmedCode,
        appVersion: app.getVersion(),
        platform: process.platform,
      }),
    });

    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
      return {
        success: false,
        message: data.message || `验证失败 (${response.status})`,
      };
    }

    if (data.success === true || data.valid === true) {
      setActivation(trimmedCode);
      return { success: true, message: "激活成功" };
    }

    return {
      success: false,
      message: data.message || "激活码无效或已被使用",
    };
  } catch (error) {
    const err = error as Error;
    const message = err.message || String(error);
    if (message.includes("fetch") || message.includes("network")) {
      return { success: false, message: "网络连接失败，请检查网络后重试" };
    }
    return {
      success: false,
      message: `验证失败: ${message}`,
    };
  }
};
