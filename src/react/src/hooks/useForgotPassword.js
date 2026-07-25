import { useState } from "react";
import * as api from "../api";

/**
 * Forgot / reset password flow only — not form fields or UI.
 *
 * @returns {{
 *   loading: boolean,
 *   emailPendingReset: string,
 *   requestReset: (payload: object) => Promise<
 *     | { status: 'code_sent' }
 *     | { status: 'error', error: unknown }
 *   >,
 *   resetPassword: (payload: object) => Promise<
 *     | { status: 'success' }
 *     | { status: 'error', error: unknown }
 *   >,
 *   clearPending: () => void,
 * }}
 */
export default function useForgotPassword() {
  const [loading, setLoading] = useState(false);
  const [emailPendingReset, setEmailPendingReset] = useState("");

  const clearPending = () => {
    setEmailPendingReset("");
  };

  const requestReset = async (payload) => {
    setLoading(true);
    try {
      await api.postForgotPassword(payload);
      setEmailPendingReset(payload.email ?? payload.phone ?? "");
      return { status: "code_sent" };
    } catch (error) {
      return { status: "error", error };
    } finally {
      setLoading(false);
    }
  };

  const resetPassword = async (payload) => {
    setLoading(true);
    try {
      await api.postResetPassword({
        email: emailPendingReset,
        ...payload,
      });
      setEmailPendingReset("");
      return { status: "success" };
    } catch (error) {
      return { status: "error", error };
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    emailPendingReset,
    requestReset,
    resetPassword,
    clearPending,
  };
}
