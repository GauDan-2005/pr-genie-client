import { useState, useCallback } from "react";
import axios from "axios";

interface WebhookStatus {
  active: boolean;
  webhookId: string | null;
  config?: any;
}

const useWebhookStatus = () => {
  const [webhookStatuses, setWebhookStatuses] = useState<
    Record<string, WebhookStatus>
  >({});
  const [loading, setLoading] = useState(false);
  const token = localStorage.getItem("userToken");

  const getWebhookStatus = useCallback(async (
    repoId: string
  ): Promise<WebhookStatus | null> => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/webhooks/status/${repoId}`,
        {
          headers: {
            Authorization: "Bearer " + token,
          },
          withCredentials: true,
        }
      );

      if (response.status === 200) {
        const status = response.data;
        setWebhookStatuses((prev) => ({
          ...prev,
          [repoId]: status,
        }));
        return status;
      }
      return null;
    } catch (err) {
      console.error("Error fetching webhook status:", err);
      return null;
    }
  }, [token]);

  const getMultipleWebhookStatuses = useCallback(async (repoIds: string[]) => {
    setLoading(true);
    try {
      const statusPromises = repoIds.map((repoId) => getWebhookStatus(repoId));
      await Promise.all(statusPromises);
    } catch (err) {
      console.error("Error fetching multiple webhook statuses:", err);
    } finally {
      setLoading(false);
    }
  }, [getWebhookStatus]);

  const isWebhookActive = (repoId: string): boolean => {
    return webhookStatuses[repoId]?.active || false;
  };

  const getWebhookId = (repoId: string): string | null => {
    return webhookStatuses[repoId]?.webhookId || null;
  };

  return {
    webhookStatuses,
    loading,
    getWebhookStatus,
    getMultipleWebhookStatuses,
    isWebhookActive,
    getWebhookId,
  };
};

export default useWebhookStatus;
