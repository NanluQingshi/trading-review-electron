/*
 * @Author: NanluQingshi
 * @Date: 2026-02-07 16:48:51
 * @LastEditors: NanluQingshi
 * @LastEditTime: 2026-02-07 16:56:12
 * @Description:
 */
import { app } from "electron";
import path from "path";
import fs from "fs";
import crypto from "crypto";

const CONFIG_FILE_NAME = "config.json";

// 配置加密相关（提高用户手动篡改门槛）
// 注意：密钥仍然在本地代码中，主要是防君子不防小人
const CONFIG_ENCRYPTION_KEY = crypto
  .createHash("sha256")
  .update("trading-review-config-secret-key")
  .digest(); // 32 bytes for aes-256
const CONFIG_ENCRYPTION_ALGO = "aes-256-gcm";

interface EncryptedConfigFile {
  __encrypted__: true;
  v: 1;
  iv: string; // base64
  tag: string; // base64
  data: string; // base64 cipher text
}

type PlainConfig = Record<string, any>;

const getConfigPath = () => {
  return path.join(app.getPath("userData"), CONFIG_FILE_NAME);
};

const decryptConfig = (raw: string): PlainConfig => {
  try {
    const parsed = JSON.parse(raw);
    if (!parsed || parsed.__encrypted__ !== true) {
      // 旧版本未加密配置，直接返回
      return parsed || {};
    }

    const enc = parsed as EncryptedConfigFile;
    const iv = Buffer.from(enc.iv, "base64");
    const tag = Buffer.from(enc.tag, "base64");
    const data = Buffer.from(enc.data, "base64");

    const decipher = crypto.createDecipheriv(
      CONFIG_ENCRYPTION_ALGO,
      CONFIG_ENCRYPTION_KEY,
      iv,
    );
    decipher.setAuthTag(tag);
    const decrypted = Buffer.concat([decipher.update(data), decipher.final()]);
    const json = decrypted.toString("utf-8");
    return JSON.parse(json);
  } catch (error) {
    console.error("解密配置文件失败:", error);
    // 解密失败时，为安全起见返回空配置，相当于未经激活且未开始试用
    return {};
  }
};

const encryptConfig = (config: PlainConfig): EncryptedConfigFile => {
  const json = JSON.stringify(config);
  const iv = crypto.randomBytes(12); // GCM 推荐 12 bytes IV
  const cipher = crypto.createCipheriv(
    CONFIG_ENCRYPTION_ALGO,
    CONFIG_ENCRYPTION_KEY,
    iv,
  );
  const encrypted = Buffer.concat([cipher.update(json, "utf-8"), cipher.final()]);
  const tag = cipher.getAuthTag();

  return {
    __encrypted__: true,
    v: 1,
    iv: iv.toString("base64"),
    tag: tag.toString("base64"),
    data: encrypted.toString("base64"),
  };
};

const getConfig = (): PlainConfig => {
  try {
    const configPath = getConfigPath();
    if (fs.existsSync(configPath)) {
      const raw = fs.readFileSync(configPath, "utf-8");
      return decryptConfig(raw);
    }
    return {};
  } catch (error) {
    console.error("读取配置文件失败:", error);
    return {};
  }
};

const setConfig = (config: PlainConfig) => {
  try {
    const configPath = getConfigPath();
    const configDir = path.dirname(configPath);

    if (!fs.existsSync(configDir)) {
      fs.mkdirSync(configDir, { recursive: true });
    }

    const encrypted = encryptConfig(config);
    fs.writeFileSync(configPath, JSON.stringify(encrypted, null, 2));
    return true;
  } catch (error) {
    console.error("写入配置文件失败:", error);
    return false;
  }
};

export const getDataPath = () => {
  const config = getConfig();
  return config.dataPath || null;
};

export const setDataPath = (dataPath: string) => {
  const config = getConfig();
  config.dataPath = dataPath;
  return setConfig(config);
};

export const clearDataPath = () => {
  const config = getConfig();
  delete config.dataPath;
  return setConfig(config);
};

// 激活相关配置
// 默认试用时长：3 天
const TRIAL_DAYS = 3;
const TRIAL_DURATION_MS = TRIAL_DAYS * 24 * 60 * 60 * 1000;

export const getActivationStatus = (): boolean => {
  const config = getConfig();

  // 已激活用户，直接放行
  if (config.activated === true) {
    return true;
  }

  // 未激活用户：仅在试用期内放行（trialStartAt 必须已存在）
  if (!config.trialStartAt) {
    return false;
  }

  const trialStartTime = Date.parse(config.trialStartAt);
  if (Number.isNaN(trialStartTime)) {
    return false;
  }

  const diff = Date.now() - trialStartTime;
  return diff < TRIAL_DURATION_MS;
};

export const getTrialInfo = () => {
  const config = getConfig();

  if (!config.trialStartAt) {
    return {
      enabled: true, // 尚未开始试用，允许开启
      daysLeft: TRIAL_DAYS,
      totalDays: TRIAL_DAYS,
    };
  }

  const trialStartTime = Date.parse(config.trialStartAt);
  if (Number.isNaN(trialStartTime)) {
    return {
      enabled: false,
      daysLeft: 0,
      totalDays: TRIAL_DAYS,
    };
  }

  const diff = Date.now() - trialStartTime;
  const msLeft = Math.max(0, TRIAL_DURATION_MS - diff);

  // 为了兼容之前展示“剩余几天”的文案，这里仍然按天折算，
  // 但 enabled 严格按照毫秒级剩余时间判断
  const daysUsed = Math.floor(diff / (24 * 60 * 60 * 1000));
  const daysLeft = Math.max(0, TRIAL_DAYS - daysUsed);

  return {
    enabled: msLeft > 0,
    daysLeft,
    totalDays: TRIAL_DAYS,
  };
};

export const startTrial = () => {
  const config = getConfig();

  if (!config.trialStartAt) {
    config.trialStartAt = new Date().toISOString();
    setConfig(config);
  }

  const countdown = getTrialCountdown();

  return {
    success: countdown.enabled,
    enabled: countdown.enabled,
    daysLeft: countdown.enabled ? 1 : 0,
    totalDays: TRIAL_DAYS,
  };
};

// 获取试用剩余时间（毫秒），用于前端做精确的分钟级倒计时提示
export const getTrialCountdown = () => {
  const config = getConfig();

  // 已激活用户不再视为试用
  if (config.activated === true) {
    return {
      enabled: false,
      msLeft: 0,
      totalMs: TRIAL_DURATION_MS,
    };
  }

  if (!config.trialStartAt) {
    return {
      enabled: false,
      msLeft: 0,
      totalMs: TRIAL_DURATION_MS,
    };
  }

  const trialStartTime = Date.parse(config.trialStartAt);
  if (Number.isNaN(trialStartTime)) {
    return {
      enabled: false,
      msLeft: 0,
      totalMs: TRIAL_DURATION_MS,
    };
  }

  const diff = Date.now() - trialStartTime;
  const msLeft = Math.max(0, TRIAL_DURATION_MS - diff);

  return {
    enabled: msLeft > 0,
    msLeft,
    totalMs: TRIAL_DURATION_MS,
  };
};

export const setActivation = (code: string) => {
  const config = getConfig();
  config.activated = true;
  config.activatedAt = new Date().toISOString();
  config.activationCode = code; // 仅用于记录，不用于验证
  return setConfig(config);
};

export const getActivationServerUrl = (): string | null => {
  const config = getConfig();
  return config.activationServerUrl || null;
};
