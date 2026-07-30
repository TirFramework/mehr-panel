import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import * as api from "../api";
import { persistLoginSession } from "../lib/loginSession";
import { clearSidebarCache } from "../lib/sidebarCache";

/**
 * Auth flow only — not form fields, labels, rules, or translations.
 *
 * `login(payload)` posts whatever the UI collects
 * (email + password, phone + password, …).
 *
 * @returns {{
 *   loading: boolean,
 *   mustVerify: boolean,
 *   login: (payload: object) => Promise<
 *     | { status: 'success' }
 *     | { status: 'must_verify', message?: string }
 *     | { status: 'no_token' }
 *     | { status: 'error', error: unknown }
 *   >,
 *   resetVerification: () => void,
 * }}
 */
export default function useLogin() {
  const queryClient = useQueryClient();
  const [mustVerify, setMustVerify] = useState(false);
  const [loading, setLoading] = useState(false);

  const resetVerification = () => {
    setMustVerify(false);
  };

  const login = async (payload) => {
    setLoading(true);

    try {
      const res = await api.postLogin(payload);

      if (res.must_verify === true) {
        setMustVerify(true);
        return {
          status: "must_verify",
          message: res.message?.error ?? res.message,
        };
      }

      if (!res?.api_token || !persistLoginSession(res.api_token)) {
        return { status: "no_token" };
      }

      // Drop any anonymous/failed panel queries from the login screen
      // so DefaultLayout does not reuse a cached 401 for ["general"].
      queryClient.removeQueries({ queryKey: ["general"] });
      queryClient.removeQueries({ queryKey: ["sidebar"] });
      clearSidebarCache();

      return { status: "success" };
    } catch (error) {
      return { status: "error", error };
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    mustVerify,
    login,
    resetVerification,
  };
}
