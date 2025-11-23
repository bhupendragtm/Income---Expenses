import { useState, useCallback } from 'react';
import apiClient from '../api/client';

interface UseCrudOptions {
  onSuccess?: (data: any) => void;
  onError?: (error: any) => void;
}

interface CrudState {
  data: any[];
  loading: boolean;
  error: any | null;
}

export const useCrud = (resource: string, options: UseCrudOptions = {}) => {
  const [state, setState] = useState<CrudState>({
    data: [],
    loading: false,
    error: null,
  });

  const getMethodName = (action: 'get' | 'create' | 'update' | 'delete', resource: string): string => {
    const singular = resource.endsWith('s') ? resource.slice(0, -1) : resource;
    const capitalized = singular.charAt(0).toUpperCase() + singular.slice(1);
    const methodName = `${action}${capitalized}${action === 'get' ? 's' : ''}`;
    return methodName;
  };

  const fetchAll = useCallback(async (config?: any) => {
    setState((s) => ({ ...s, loading: true, error: null }));
    try {
      const methodName = getMethodName('get', resource);
      const method = (apiClient as any)[methodName];
      const res = await method.call(apiClient, config);
      setState((s) => ({ ...s, data: res.data || res, loading: false }));
      options.onSuccess?.(res.data || res);
      return res.data || res;
    } catch (error) {
      setState((s) => ({ ...s, error, loading: false }));
      options.onError?.(error);
      throw error;
    }
  }, [resource, options]);

  const create = useCallback(async (payload: any) => {
    setState((s) => ({ ...s, loading: true, error: null }));
    try {
      const methodName = getMethodName('create', resource);
      const method = (apiClient as any)[methodName];
      const res = await method.call(apiClient, payload);
      setState((s) => ({ ...s, data: [...s.data, res.data || res], loading: false }));
      options.onSuccess?.(res.data || res);
      return res.data || res;
    } catch (error) {
      setState((s) => ({ ...s, error, loading: false }));
      options.onError?.(error);
      throw error;
    }
  }, [resource, options]);

  const update = useCallback(async (id: string, payload: any) => {
    setState((s) => ({ ...s, loading: true, error: null }));
    try {
      const methodName = getMethodName('update', resource);
      const method = (apiClient as any)[methodName];
      const res = await method.call(apiClient, id, payload);
      setState((s) => ({
        ...s,
        data: s.data.map((item) => (item.id === id ? (res.data || res) : item)),
        loading: false,
      }));
      options.onSuccess?.(res.data || res);
      return res.data || res;
    } catch (error) {
      setState((s) => ({ ...s, error, loading: false }));
      options.onError?.(error);
      throw error;
    }
  }, [resource, options]);

  const delete_ = useCallback(async (id: string) => {
    setState((s) => ({ ...s, loading: true, error: null }));
    try {
      const methodName = getMethodName('delete', resource);
      const method = (apiClient as any)[methodName];
      await method.call(apiClient, id);
      setState((s) => ({
        ...s,
        data: s.data.filter((item) => item.id !== id),
        loading: false,
      }));
      options.onSuccess?.(null);
      return true;
    } catch (error) {
      setState((s) => ({ ...s, error, loading: false }));
      options.onError?.(error);
      throw error;
    }
  }, [resource, options]);

  return {
    ...state,
    fetchAll,
    create,
    update,
    delete: delete_,
  };
};
