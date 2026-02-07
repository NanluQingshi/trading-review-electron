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

const CONFIG_FILE_NAME = "config.json";

const getConfigPath = () => {
  return path.join(app.getPath("userData"), CONFIG_FILE_NAME);
};

const getConfig = () => {
  try {
    const configPath = getConfigPath();
    if (fs.existsSync(configPath)) {
      const data = fs.readFileSync(configPath, "utf-8");
      return JSON.parse(data);
    }
    return {};
  } catch (error) {
    console.error("读取配置文件失败:", error);
    return {};
  }
};

const setConfig = (config: any) => {
  try {
    const configPath = getConfigPath();
    const configDir = path.dirname(configPath);

    if (!fs.existsSync(configDir)) {
      fs.mkdirSync(configDir, { recursive: true });
    }

    fs.writeFileSync(configPath, JSON.stringify(config, null, 2));
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
