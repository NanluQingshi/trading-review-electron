/*
 * @Author: NanluQingshi
 * @Date: 2026-01-18 01:10:59
 * @LastEditors: NanluQingshi
 * @LastEditTime: 2026-01-18 01:55:38
 * @Description: 交易方法库hooks
 */
import { useState, useEffect } from "react";
import { message } from "antd";
import { methodsApi } from "@/services/api";
import { Method } from "@/types";

export const useMethods = () => {
  const [methods, setMethods] = useState<Method[]>([]);
  const [loading, setLoading] = useState(false);

  // 获取交易方法列表
  const fetchMethods = async () => {
    setLoading(true);
    try {
      const response = await methodsApi.getMethods();
      if (response && response.success) {
        setMethods(response.data || []);
      } else {
        setMethods([]);
      }
    } catch (error) {
      message.error("获取方法库失败");
      setMethods([]);
    } finally {
      setLoading(false);
    }
  };

  // 创建交易方法
  const createMethod = async (methodData: Partial<Method>) => {
    try {
      const response = await methodsApi.createMethod(methodData);
      if (response && response.success) {
        message.success("创建成功");
        fetchMethods();
        return response.data;
      } else {
        message.error("创建失败");
        throw new Error("创建失败");
      }
    } catch (error) {
      message.error("创建失败");
      throw error;
    }
  };

  // 更新交易方法
  const updateMethod = async (id: string, methodData: Partial<Method>) => {
    try {
      const response = await methodsApi.updateMethod(id, methodData);
      if (response && response.success) {
        message.success("更新成功");
        fetchMethods();
        return response.data;
      } else {
        message.error("更新失败");
        throw new Error("更新失败");
      }
    } catch (error) {
      message.error("更新失败");
      throw error;
    }
  };

  // 删除交易方法
  const deleteMethod = async (id: string) => {
    try {
      const response = await methodsApi.deleteMethod(id);
      if (response && response.success) {
        message.success("删除成功");
        fetchMethods();
      } else {
        message.error("删除失败");
        throw new Error("删除失败");
      }
    } catch (error) {
      message.error("删除失败");
      throw error;
    }
  };

  // 初始加载交易方法
  useEffect(() => {
    fetchMethods();
  }, []);

  return {
    methods,
    loading,
    fetchMethods,
    createMethod,
    updateMethod,
    deleteMethod,
  };
};
